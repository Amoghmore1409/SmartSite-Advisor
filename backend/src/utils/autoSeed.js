const User = require('../models/User');
const Property = require('../models/Property');
const BuyerPreferences = require('../models/BuyerPreferences');
const SellerInsights = require('../models/SellerInsights');

const sampleProperties = [
  {
    title: 'Prestige Lakeside Habitat',
    description: 'Premium 3BHK apartment with lake view in the heart of Whitefield. World-class amenities including Olympic swimming pool, state-of-art gym, and children\'s play area.',
    propertyType: 'Apartment',
    listingType: 'Sale',
    price: 12000000,
    pricePerSqFt: 8275,
    location: {
      type: 'Point',
      coordinates: [77.7480, 12.9698],
      address: 'Prestige Lakeside Habitat, Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560066',
    },
    specifications: {
      bedrooms: 3, bathrooms: 3, balconies: 2,
      carpetArea: 1450, builtUpArea: 1800,
      floor: 12, totalFloors: 25,
      parkingSpots: 2, facing: 'East',
      furnishingStatus: 'Semi-Furnished', age: 2,
    },
    amenities: ['Lift', 'Gym', 'Swimming Pool', 'Parking', 'Security', 'Power Backup', 'Garden', 'Clubhouse', 'CCTV', 'Children Play Area', 'Jogging Track'],
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'],
    status: 'available',
    aiScore: { overall: 88, locationScore: 90, connectivityScore: 85, amenitiesScore: 92, roiPotential: 82, lastScoredAt: new Date() },
    views: 342, saves: 45, inquiries: 12,
  },
  {
    title: 'Brigade Gateway Enclave',
    description: 'Luxurious 4BHK villa with private garden in a gated community. Premium marble flooring, modular kitchen, and smart home automation throughout.',
    propertyType: 'Villa',
    listingType: 'Sale',
    price: 18000000,
    pricePerSqFt: 6000,
    location: {
      type: 'Point',
      coordinates: [77.5946, 12.9716],
      address: 'Brigade Gateway, Rajajinagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560010',
    },
    specifications: {
      bedrooms: 4, bathrooms: 4, balconies: 3,
      carpetArea: 3000, builtUpArea: 3500, plotArea: 2400,
      floor: 0, totalFloors: 3,
      parkingSpots: 3, facing: 'North',
      furnishingStatus: 'Fully-Furnished', age: 1,
    },
    amenities: ['Gym', 'Swimming Pool', 'Parking', 'Security', 'Power Backup', 'Garden', 'Clubhouse', 'CCTV', 'Intercom', 'Children Play Area', 'Tennis Court'],
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'],
    status: 'available',
    aiScore: { overall: 85, locationScore: 82, connectivityScore: 78, amenitiesScore: 90, roiPotential: 88, lastScoredAt: new Date() },
    views: 567, saves: 78, inquiries: 23,
  },
  {
    title: 'Sobha Dream Acres',
    description: 'Modern 2BHK flat in one of Bangalore\'s fastest-growing corridors. Excellent connectivity to ORR and upcoming metro station. Great for first-time buyers.',
    propertyType: 'Apartment',
    listingType: 'Sale',
    price: 9500000,
    pricePerSqFt: 7917,
    location: {
      type: 'Point',
      coordinates: [77.6970, 12.8448],
      address: 'Sobha Dream Acres, Panathur Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560103',
    },
    specifications: {
      bedrooms: 2, bathrooms: 2, balconies: 1,
      carpetArea: 1200, builtUpArea: 1450,
      floor: 8, totalFloors: 20,
      parkingSpots: 1, facing: 'South-East',
      furnishingStatus: 'Semi-Furnished', age: 3,
    },
    amenities: ['Lift', 'Gym', 'Swimming Pool', 'Parking', 'Security', 'Power Backup', 'CCTV', 'Jogging Track', 'Gas Pipeline'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'],
    status: 'available',
    aiScore: { overall: 79, locationScore: 75, connectivityScore: 82, amenitiesScore: 72, roiPotential: 85, lastScoredAt: new Date() },
    views: 234, saves: 32, inquiries: 8,
  },
  {
    title: 'Lodha World Towers',
    description: 'Super-luxurious 4BHK residence in Lower Parel, Mumbai with stunning Arabian Sea views, private elevator access, and concierge service.',
    propertyType: 'Apartment',
    listingType: 'Sale',
    price: 45000000,
    pricePerSqFt: 22500,
    location: {
      type: 'Point',
      coordinates: [72.8295, 18.9950],
      address: 'Lodha World Towers, Lower Parel',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400013',
    },
    specifications: {
      bedrooms: 4, bathrooms: 5, balconies: 3,
      carpetArea: 2000, builtUpArea: 2600,
      floor: 45, totalFloors: 75,
      parkingSpots: 3, facing: 'West',
      furnishingStatus: 'Fully-Furnished', age: 1,
    },
    amenities: ['Lift', 'Gym', 'Swimming Pool', 'Parking', 'Security', 'Power Backup', 'Clubhouse', 'CCTV', 'Intercom', 'Water Storage', 'Maintenance Staff'],
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'],
    status: 'available',
    aiScore: { overall: 94, locationScore: 96, connectivityScore: 92, amenitiesScore: 98, roiPotential: 90, lastScoredAt: new Date() },
    views: 890, saves: 142, inquiries: 41,
  },
  {
    title: 'Godrej Splendour',
    description: 'Elegant 3BHK apartment with panoramic city views. Premium finishes including Italian marble, designer fittings, and smart home integration.',
    propertyType: 'Apartment',
    listingType: 'Sale',
    price: 15500000,
    pricePerSqFt: 9700,
    location: {
      type: 'Point',
      coordinates: [77.6629, 12.9352],
      address: 'Godrej Splendour, Brookefield',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560048',
    },
    specifications: {
      bedrooms: 3, bathrooms: 3, balconies: 2,
      carpetArea: 1600, builtUpArea: 1950,
      floor: 18, totalFloors: 30,
      parkingSpots: 2, facing: 'North-East',
      furnishingStatus: 'Fully-Furnished', age: 0,
    },
    amenities: ['Lift', 'Gym', 'Swimming Pool', 'Parking', 'Security', 'Power Backup', 'Garden', 'Clubhouse', 'CCTV', 'Intercom', 'Rainwater Harvesting', 'Children Play Area'],
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'],
    status: 'available',
    aiScore: { overall: 91, locationScore: 88, connectivityScore: 86, amenitiesScore: 95, roiPotential: 90, lastScoredAt: new Date() },
    views: 678, saves: 112, inquiries: 34,
  },
];

const autoSeed = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('ℹ️ Database already contains data.');
      return;
    }

    console.log('🌱 Database is empty. Seeding initial mock data...');
    const seller = await User.create({
      name: 'Raj Properties',
      email: 'seller@smartsite.com',
      password: 'password123',
      role: 'seller',
      phone: '+91 98765 43210',
      isVerified: true,
    });

    const buyer = await User.create({
      name: 'Rahul Sharma',
      email: 'buyer@smartsite.com',
      password: 'password123',
      role: 'buyer',
      phone: '+91 91234 56789',
      isVerified: true,
    });

    await BuyerPreferences.create({
      user: buyer._id,
      preferredPropertyTypes: ['Apartment', 'Villa'],
      listingPreference: 'Sale',
      budget: { min: 5000000, max: 50000000 },
      preferredLocations: ['Bangalore', 'Mumbai', 'Whitefield'],
      minBedrooms: 2,
      requiredAmenities: ['Gym', 'Parking'],
      buyerSegment: 'family',
      weights: {
        price: 0.30,
        location: 0.30,
        amenities: 0.20,
        connectivity: 0.10,
        roiPotential: 0.10,
      },
      referencePoint: {
        type: 'Point',
        coordinates: [77.6410, 12.9716],
      },
      isComplete: true,
    });

    const createdProperties = [];
    for (const propData of sampleProperties) {
      const property = await Property.create({
        ...propData,
        seller: seller._id,
      });
      createdProperties.push(property);
    }

    for (const property of createdProperties) {
      const aiScore = property.aiScore || {};
      await SellerInsights.create({
        property: property._id,
        seller: seller._id,
        currentScore: {
          overall: aiScore.overall || 70,
          locationScore: aiScore.locationScore || 70,
          connectivityScore: aiScore.connectivityScore || 70,
          amenitiesScore: aiScore.amenitiesScore || 70,
          roiPotential: aiScore.roiPotential || 70,
        },
        scoreHistory: [
          { score: (aiScore.overall || 70) - 8, recordedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), reason: 'Initial scoring' },
          { score: (aiScore.overall || 70) - 3, recordedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), reason: 'Added amenities' },
          { score: aiScore.overall || 70, recordedAt: new Date(), reason: 'Latest analysis' },
        ],
        demandStats: {
          totalViews: property.views,
          uniqueViews: Math.round(property.views * 0.7),
          totalSaves: property.saves,
          totalInquiries: property.inquiries,
          weeklyTrend: [
            { week: '2026-W10', views: Math.round(property.views * 0.1), inquiries: Math.round(property.inquiries * 0.1) },
            { week: '2026-W11', views: Math.round(property.views * 0.12), inquiries: Math.round(property.inquiries * 0.12) },
            { week: '2026-W12', views: Math.round(property.views * 0.15), inquiries: Math.round(property.inquiries * 0.15) },
            { week: '2026-W13', views: Math.round(property.views * 0.18), inquiries: Math.round(property.inquiries * 0.2) },
            { week: '2026-W14', views: Math.round(property.views * 0.2), inquiries: Math.round(property.inquiries * 0.22) },
            { week: '2026-W15', views: Math.round(property.views * 0.25), inquiries: Math.round(property.inquiries * 0.2) },
          ],
        },
        demandLevel: property.inquiries > 20 ? 'very_high' : property.inquiries > 10 ? 'high' : 'moderate',
        buyerSegmentMatch: {
          family: 75,
          investor: 60,
          student: 25,
          bachelor: 35,
          retiree: 50,
        },
        topTargetSegment: 'family',
        improvementSuggestions: [
          { type: 'amenity', priority: 'high', message: 'Add Gym amenity to boost score', impact: 12 },
          { type: 'imagery', priority: 'medium', message: 'Add virtual tour 3D walkthrough', impact: 18 }
        ],
        lastAiAnalysisAt: new Date(),
        analysisVersion: '1.0.0',
      });
    }

    console.log('✅ Auto-seed completed successfully!');
  } catch (error) {
    console.error('⚠️ Auto-seed error:', error.message);
  }
};

module.exports = autoSeed;
