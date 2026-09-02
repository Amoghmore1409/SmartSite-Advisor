import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Sparkles, CloudSun, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

// Comprehensive Micro-Locality Coordinates Lookup Table for MMR (Mumbai, Thane, Navi Mumbai)
const LOCALITY_COORDINATES = {
  // South & Central Mumbai
  'lower parel': [18.9950, 72.8280],
  'worli': [19.0176, 72.8172],
  'mahalaxmi': [18.9827, 72.8250],
  'dadar': [19.0178, 72.8478],
  'prabhadevi': [19.0160, 72.8280],
  'colaba': [18.9067, 72.8147],
  'nariman point': [18.9260, 72.8228],

  // Western Suburbs
  'bandra west': [19.0596, 72.8295],
  'bandra east': [19.0625, 72.8512],
  'bandra': [19.0596, 72.8295],
  'bkc': [19.0657, 72.8687],
  'bandra kurla complex': [19.0657, 72.8687],
  'khar': [19.0697, 72.8335],
  'santacruz': [19.0843, 72.8360],
  'santa cruz': [19.0843, 72.8360],
  'juhu': [19.1075, 72.8263],
  'andheri east': [19.1136, 72.8697],
  'andheri west': [19.1363, 72.8277],
  'andheri': [19.1136, 72.8697],
  'lokhandwala': [19.1415, 72.8235],
  'goregaon east': [19.1663, 72.8526],
  'goregaon west': [19.1680, 72.8390],
  'goregaon': [19.1663, 72.8526],
  'malad west': [19.1860, 72.8485],
  'malad east': [19.1840, 72.8600],
  'malad': [19.1860, 72.8485],
  'kandivali': [19.2045, 72.8522],
  'borivali east': [19.2288, 72.8541],
  'borivali west': [19.2310, 72.8470],
  'borivali': [19.2288, 72.8541],
  'dahisar': [19.2570, 72.8590],

  // Central Suburbs
  'powai': [19.1176, 72.9060],
  'hiranandani': [19.1176, 72.9060],
  'chembur': [19.0623, 72.8997],
  'ghatkopar': [19.0860, 72.9080],
  'vikhroli': [19.1000, 72.9200],
  'kanjurmarg': [19.1300, 72.9300],
  'bhandup': [19.1500, 72.9400],
  'mulund': [19.1726, 72.9565],

  // Thane
  'ghodbunder road': [19.2650, 72.9640],
  'ghodbunder': [19.2650, 72.9640],
  'majiwada': [19.2190, 72.9860],
  'kapurbawdi': [19.2290, 72.9810],
  'vartak nagar': [19.2100, 72.9650],
  'thane west': [19.2183, 72.9781],
  'thane east': [19.1870, 72.9720],
  'thane': [19.2183, 72.9781],

  // Navi Mumbai
  'vashi': [19.0770, 72.9980],
  'sanpada': [19.0640, 73.0080],
  'nerul': [19.0330, 73.0180],
  'seawoods': [19.0108, 73.0169],
  'cbd belapur': [19.0200, 73.0400],
  'belapur': [19.0200, 73.0400],
  'kharghar': [19.0473, 73.0699],
  'kamothe': [19.0260, 73.0950],
  'panvel': [18.9894, 73.1175],
  'airoli': [19.1570, 72.9980],
  'ghansoli': [19.1250, 73.0000],
  'kopar khairane': [19.1020, 73.0070],
};

function getAccurateCoordinates(prop, index = 0) {
  const coords = prop.location?.coordinates;
  const hasCoords = Array.isArray(coords) && coords.length === 2 && coords[0] !== 0 && coords[1] !== 0;

  let lat = null;
  let lng = null;

  if (hasCoords) {
    const isGenericCenter = Math.abs(coords[0] - 72.8777) < 0.005 && Math.abs(coords[1] - 19.0760) < 0.005;
    if (!isGenericCenter) {
      lng = coords[0];
      lat = coords[1];
    }
  }

  if (!lat || !lng) {
    const textToMatch = `${prop.title || ''} ${prop.location?.address || ''} ${prop.location?.city || ''} ${prop.locality || ''} ${prop.description || ''}`.toLowerCase();
    
    for (const [locality, locCoords] of Object.entries(LOCALITY_COORDINATES)) {
      if (textToMatch.includes(locality)) {
        lat = locCoords[0];
        lng = locCoords[1];
        break;
      }
    }
  }

  if (!lat || !lng) {
    const city = prop.location?.city?.toLowerCase() || '';
    if (city.includes('thane')) {
      lat = 19.2183; lng = 72.9781;
    } else if (city.includes('navi mumbai')) {
      lat = 19.0330; lng = 73.0297;
    } else {
      lat = 19.0760; lng = 72.8777;
    }
  }

  const idStr = prop._id || prop.id || prop.title || `${index}`;
  let hash = 0;
  for (let i = 0; i < idStr.length; i++) {
    hash = (hash << 5) - hash + idStr.charCodeAt(i);
    hash |= 0;
  }
  const jitterLat = (((Math.abs(hash) % 100) / 100) - 0.5) * 0.003;
  const jitterLng = (((Math.abs(hash >> 2) % 100) / 100) - 0.5) * 0.003;

  return [lat + jitterLat, lng + jitterLng];
}

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
        z-index: ${isHighlighted ? 999 : 50};
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

function FitBoundsToMarkers({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points || points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 14);
      return;
    }
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
  }, [points, map]);
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
  const propertyList = properties || [];

  // Compute accurate coordinates for each property using micro-locality geocoder
  const mappedProperties = propertyList.map((p, i) => ({
    property: p,
    position: getAccurateCoordinates(p, i)
  }));

  const isSingleProperty = mappedProperties.length === 1;
  const defaultCenter = isSingleProperty 
    ? mappedProperties[0].position
    : [19.0760, 72.8777];

  const defaultZoom = isSingleProperty ? 14 : 11;

  const poiFitPoints = isSingleProperty && customPois.length > 0
    ? [defaultCenter, ...customPois.map((poi) => [poi.lat, poi.lng])]
    : null;

  const formatPrice = (p) => {
    if (!p) return 'Price on Request';
    if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
    if (p >= 100000) return `₹${(p / 100000).toFixed(2)} L`;
    return `₹${p}`;
  };

  return (
    <div className={`relative w-full ${heightClass} rounded-3xl overflow-hidden border border-slate-200 shadow-soft z-0`}>
      <MapContainer 
        center={defaultCenter} 
        zoom={defaultZoom} 
        scrollWheelZoom={true} 
        style={{ width: '100%', height: '100%' }}
      >
        <MapRecenter center={defaultCenter} />
        {poiFitPoints && <FitBoundsToMarkers points={poiFitPoints} />}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Property Markers */}
        {mappedProperties.map(({ property: prop, position }, i) => {
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
                    <Sparkles size={12} /> {prop.aiScore?.overall != null ? `${prop.aiScore.overall}% AI Match` : 'Not yet scored'}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm truncate mb-1">{prop.title}</h4>
                  <p className="text-slate-500 text-xs truncate mb-2">{prop.location?.address || prop.location?.city}</p>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-2 mb-2">
                    <span className="font-extrabold text-slate-900 text-sm">{formatPrice(prop.price)}</span>
                    {prop.environmentScore?.aqi != null && (
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                        <CloudSun size={12} /> AQI {prop.environmentScore.aqi}
                      </span>
                    )}
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

        {/* Dynamic Nearby POI Markers */}
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

      {/* Floating Info & Active Filter Badges - z-[100] keeps it safely below fixed Navbar (z-[1000]) */}
      <div className="absolute top-4 right-4 z-[100] flex flex-col items-end gap-2 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full border border-white/20 shadow-lg flex items-center gap-2 pointer-events-auto">
          <MapPin size={14} className="text-emerald-400" />
          {isSingleProperty ? 'Neighborhood & Spatial View' : `Showing ${mappedProperties.length} Regional Properties`}
        </div>

        {activePoiCategory && (
          <div className="bg-amber-500/90 backdrop-blur-md text-slate-950 text-xs font-extrabold px-4 py-2 rounded-full border border-amber-300 shadow-xl flex items-center gap-2 pointer-events-auto">
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
