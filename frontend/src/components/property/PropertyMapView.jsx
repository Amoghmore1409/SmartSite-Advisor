import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Sparkles, CloudSun, ExternalLink, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

// Custom Property Pin Icon
const createCustomIcon = (price, verified, isHighlighted = false) => {
  const priceLabel = price >= 10000000 
    ? `₹${(price / 10000000).toFixed(1)}Cr` 
    : price >= 100000 
    ? `₹${(price / 100000).toFixed(0)}L` 
    : `₹${price}`;

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background: ${isHighlighted ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' : verified ? '#0f172a' : '#1e293b'};
        color: #ffffff;
        padding: ${isHighlighted ? '8px 14px' : '6px 10px'};
        border-radius: 24px;
        font-weight: 800;
        font-size: ${isHighlighted ? '13px' : '11px'};
        border: 2px solid ${isHighlighted ? '#fbbf24' : verified ? '#10b981' : '#6366f1'};
        box-shadow: ${isHighlighted ? '0 0 20px rgba(124, 58, 237, 0.6), 0 4px 14px rgba(0,0,0,0.4)' : '0 4px 14px rgba(0,0,0,0.25)'};
        display: flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
        transform: translate(-50%, -100%);
        z-index: ${isHighlighted ? 9999 : 100};
      ">
        ${isHighlighted ? '<span style="font-size:12px;">✨</span>' : `<span style="width: 8px; height: 8px; border-radius: 50%; background: ${verified ? '#10b981' : '#6366f1'};"></span>`}
        ${priceLabel}
      </div>
    `,
    iconSize: [100, 36],
    iconAnchor: [50, 36],
  });
};

// Custom Nearby Point of Interest (POI) Pin Icon
const createPoiIcon = (category, name) => {
  const iconEmoji = category === 'school' ? '🏫' : category === 'mall' ? '🛍️' : category === 'metro' ? '🚇' : category === 'hospital' ? '🏥' : category === 'park' ? '🌳' : '📍';
  const color = category === 'school' ? '#ec4899' : category === 'mall' ? '#f59e0b' : category === 'metro' ? '#3b82f6' : category === 'hospital' ? '#ef4444' : '#10b981';

  return L.divIcon({
    className: 'custom-poi-pin',
    html: `
      <div style="
        background: #0f172a;
        color: #ffffff;
        padding: 5px 10px;
        border-radius: 16px;
        font-weight: 700;
        font-size: 11px;
        border: 2px solid ${color};
        box-shadow: 0 4px 14px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        gap: 5px;
        white-space: nowrap;
        transform: translate(-50%, -100%);
        animation: bounce 1s infinite alternate;
      ">
        <span>${iconEmoji}</span>
        <span>${name}</span>
      </div>
    `,
    iconSize: [130, 32],
    iconAnchor: [65, 32],
  });
};

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function PropertyMapView({ 
  properties, 
  onSelectProperty, 
  onOpenReport, 
  heightClass = "h-[700px]",
  highlightedPropertyIds = [],
  customPois = [],
  activePoiCategory = null
}) {
  const validProperties = (properties || []).filter(
    p => p.location?.coordinates && Array.isArray(p.location.coordinates) && p.location.coordinates.length === 2
  );

  // If single property, focus directly on it with high detail zoom (14), otherwise center on Mumbai region (11)
  const isSingleProperty = validProperties.length === 1;
  const defaultCenter = isSingleProperty 
    ? [validProperties[0].location.coordinates[1], validProperties[0].location.coordinates[0]]
    : [19.0760, 72.8777];

  const defaultZoom = isSingleProperty ? 14 : 11;

  const formatPrice = (p) => {
    if (!p) return 'Price on Request';
    if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
    if (p >= 100000) return `₹${(p / 100000).toFixed(2)} L`;
    return `₹${p}`;
  };

  return (
    <div className={`relative w-full ${heightClass} rounded-3xl overflow-hidden border border-slate-200 shadow-soft`}>
      <MapContainer 
        center={defaultCenter} 
        zoom={defaultZoom} 
        scrollWheelZoom={true} 
        style={{ width: '100%', height: '100%' }}
      >
        <MapRecenter center={defaultCenter} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Property Markers */}
        {validProperties.map((prop, i) => {
          const position = [prop.location.coordinates[1], prop.location.coordinates[0]];
          const isHighlighted = highlightedPropertyIds.includes(prop._id || prop.id);
          const icon = createCustomIcon(prop.price, prop.verifiedLive, isHighlighted);

          return (
            <Marker key={prop._id || i} position={position} icon={icon}>
              <Popup className="custom-leaflet-popup">
                <div className="w-64 p-1">
                  <img 
                    src={prop.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'} 
                    alt={prop.title}
                    className="w-full h-28 object-cover rounded-xl mb-2" 
                  />
                  <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 uppercase mb-1">
                    <Sparkles size={12} /> {prop.aiScore?.overall || 88}% AI Match
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm truncate mb-1">{prop.title}</h4>
                  <p className="text-slate-500 text-xs truncate mb-2">{prop.location?.address || prop.location?.city}</p>
                  
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2 mb-2">
                    <span className="font-extrabold text-slate-900 text-sm">{formatPrice(prop.price)}</span>
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <CloudSun size={12} /> AQI {prop.environmentScore?.aqi || 40}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/property/${prop._id}`}
                      className="flex-1 py-1.5 px-2 bg-slate-900 text-white rounded-lg text-xs font-semibold text-center hover:bg-slate-800 transition-colors"
                    >
                      View Details
                    </Link>
                    {onOpenReport && (
                      <button
                        onClick={() => onOpenReport(prop)}
                        className="py-1.5 px-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-colors"
                      >
                        AI Report
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Dynamic Nearby POI Markers (Triggered by AI Chat) */}
        {customPois.map((poi, idx) => {
          const poiIcon = createPoiIcon(poi.category, poi.name);
          return (
            <Marker key={idx} position={[poi.lat, poi.lng]} icon={poiIcon}>
              <Popup>
                <div className="p-2 text-center">
                  <h5 className="font-bold text-slate-900 text-xs">{poi.name}</h5>
                  <p className="text-[11px] text-indigo-600 font-semibold mt-1">📍 {poi.distance} from property</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Info & Active Filter Badges */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col items-end gap-2 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full border border-white/20 shadow-lg flex items-center gap-2 pointer-events-auto">
          <MapPin size={14} className="text-emerald-400" />
          {isSingleProperty ? 'Neighborhood & Spatial View' : `Showing ${validProperties.length} Regional Properties`}
        </div>

        {activePoiCategory && (
          <div className="bg-amber-500/90 backdrop-blur-md text-slate-950 text-xs font-extrabold px-4 py-2 rounded-full border border-amber-300 shadow-xl flex items-center gap-2 animate-bounce pointer-events-auto">
            <Compass size={14} className="text-slate-950" />
            Showing POIs: {activePoiCategory} ({customPois.length} Found)
          </div>
        )}

        {highlightedPropertyIds.length > 0 && (
          <div className="bg-indigo-600/95 backdrop-blur-md text-white text-xs font-extrabold px-4 py-2 rounded-full border border-indigo-400 shadow-xl flex items-center gap-2 pointer-events-auto">
            <Sparkles size={14} className="text-amber-300" />
            ✨ {highlightedPropertyIds.length} Properties Matched Your Natural Language Query!
          </div>
        )}
      </div>
    </div>
  );
}
