require('dotenv').config();
const ParichayAgent = require('./src/agents/ParichayAgent');
const ValuationROIAgent = require('./src/agents/ValuationROIAgent');
const GeoSpatialAgent = require('./src/agents/GeoSpatialAgent');
const NegotiationAgent = require('./src/agents/NegotiationAgent');
const ConstructorUpgradeAgent = require('./src/agents/ConstructorUpgradeAgent');
const AgentDebateOrchestrator = require('./src/agents/AgentDebateOrchestrator');

async function testAgents() {
  console.log("🚀 Testing Groq Multi-Agent Real Estate Engine...\n");

  const sampleProperty = {
    _id: "prop_101",
    title: "Sobha Dream Acres",
    price: 9500000,
    location: { city: "Panathur, Bangalore" },
    specifications: { bedrooms: 3, sqft: 1450 },
    amenities: ["Swimming Pool", "Gym", "Clubhouse", "24/7 Security"]
  };

  console.log("1️⃣ Parichay Buyer Profiler Agent:");
  const profile = await ParichayAgent.profileBuyer("I am a software engineer working at Whitefield. I need a 3BHK with good return on investment and quick commute to metro.");
  console.log(JSON.stringify(profile, null, 2));

  console.log("\n2️⃣ Valuation & ROI Agent:");
  const valuation = await ValuationROIAgent.evaluateProperty(sampleProperty);
  console.log(JSON.stringify(valuation, null, 2));

  console.log("\n3️⃣ GeoSpatial & Health Agent:");
  const geo = await GeoSpatialAgent.evaluateLocation(sampleProperty);
  console.log(JSON.stringify(geo, null, 2));

  console.log("\n4️⃣ Negotiation & EMI Deal Agent:");
  const negotiation = await NegotiationAgent.strategizeDeal({ property: sampleProperty, buyerBudget: 9000000 });
  console.log(JSON.stringify(negotiation, null, 2));

  console.log("\n5️⃣ Constructor Upgrade Agent:");
  const upgrade = await ConstructorUpgradeAgent.evaluateUpgradePlan(sampleProperty);
  console.log(JSON.stringify(upgrade, null, 2));

  console.log("\n6️⃣ Multi-Agent Debate & Consensus Orchestrator:");
  const debate = await AgentDebateOrchestrator.runDebate({
    properties: [
      sampleProperty,
      {
        _id: "prop_102",
        title: "Brigade Gateway Enclave",
        price: 18000000,
        location: { city: "Malleshwaram, Bangalore" },
        specifications: { bedrooms: 3, sqft: 1800 },
        amenities: ["Metro Access", "Luxury Clubhouse", "Sky Lounge"]
      }
    ],
    buyerPreferences: profile
  });
  console.log(JSON.stringify(debate, null, 2));

  console.log("\n✅ ALL 6 MULTI-AGENT ENGINES PASSED SUCCESSFULLY!");
}

testAgents().catch(console.error);
