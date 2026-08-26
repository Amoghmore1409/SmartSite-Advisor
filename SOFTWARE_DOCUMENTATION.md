# SMARTSITE ADVISOR: TECHNICAL SOFTWARE DOSSIER & ARCHITECTURE MANUAL

**Document Purpose**: Software System Architecture Description & Technical Documentation for Copyright Registration (Form XIV / Statement of Particulars)  
**System Name**: SmartSite Advisor  
**Version**: 1.0.0  
**Domain**: Real Estate Analytics, Autonomous Multi-Agent AI Engine, Geo-Environmental Scoring  

---

## 1. ABSTRACT & SYSTEM OVERVIEW

**SmartSite Advisor** is an advanced agentic AI platform engineered for real estate intelligence in the Mumbai Metropolitan Region (Mumbai, Thane, and Navi Mumbai). 

Unlike standard real estate aggregators that rely on static search filters, SmartSite Advisor deploys an **autonomous swarm of specialized AI agents** that dynamically scrape multi-portal property data (99acres, Housing.com, MagicBricks), audit local air quality (AQI) and geospatial connectivity, compute risk-adjusted ROI projections, and execute automated multi-agent debates to deliver explainable, objective property recommendations.

---

## 2. HARDWARE & SOFTWARE SPECIFICATIONS

### Hardware Requirements:
- **Server**: CPU x86-64 / ARM64, 4GB RAM minimum, 10GB SSD storage.
- **Client**: Any standard web browser (Chrome, Edge, Firefox, Safari) on Desktop or Mobile.

### Software Requirements & Stack:
- **Operating System**: Platform independent (Windows 10/11, macOS, Linux).
- **Backend Environment**: Node.js v18+, Express.js v5.
- **Frontend Environment**: React 18, Vite, Vanilla CSS with CSS Custom Properties, Framer Motion.
- **Database Engine**: MongoDB / Mongoose ODM (supported via standalone MongoDB Atlas or local MongoDB Memory Server fallback).
- **AI Infrastructure**: Groq LLaMA 3.3 / Gemini API SDK for LLM agent reasoning.

---

## 3. CORE NOVEL MODULES & AGENTIC ARCHITECTURE

### Module 1: Autonomous Multi-Agent Debate Engine (`AgentDebateOrchestrator.js`)
Coordinates adversarial debate between specialized agent roles:
- **Valuation Agent**: Audits square-foot pricing against regional historical averages.
- **GeoSpatial & Environmental Agent**: Analyzes live Air Quality Index (AQI), green cover, noise levels, and transport transit nodes.
- **Negotiation Agent**: Formulates down-payment, tenure, and EMI payment optimization strategies.
- **Debate Synthesizer**: Formulates a consensus matrix and outputs a unified **SmartScore (0-100)**.

### Module 2: Multi-Portal Scraper & Portal Sync Engine (`RealEstateScraperAgent.js` & `PortalSyncManager.js`)
- Autonomous web harvesting logic targeting major real estate listings across Mumbai, Thane, and Navi Mumbai.
- Dynamic entity resolution and deduplication logic.
- Price change detection algorithm maintaining an audit log in `priceHistory`.
- Verification tagging (`verifiedLive: true`) to grant visual green pulse badges on the client interface.

### Module 3: Parichay Buyer Profiling Agent (`ParichayAgent.js`)
- Natural language query parser converting conversational user inputs (e.g., *"Looking for a quiet 3BHK near Metro with good AQI under 2.5 Cr"*) into structured preference vectors.

---

## 4. DATABASE ENTITY RELATIONSHIP & SCHEMA SPECIFICATION

The primary `Property` document model incorporates embedded schemas for high-performance querying without relational joins:

```javascript
PropertySchema = {
  seller: ObjectId (Ref: User),
  title: String,
  propertyType: Enum ['Apartment', 'Villa', 'Plot', 'Commercial', 'Office', 'Shop', 'Farmhouse', 'Studio'],
  listingType: Enum ['Sale', 'Rent', 'Lease'],
  price: Number,
  location: { address: String, city: String, state: String, coordinates: [lng, lat] },
  specifications: { bedrooms: Number, bathrooms: Number, carpetArea: Number },
  amenities: [String],
  verifiedLive: Boolean,
  sourcePortal: String,
  lastSyncedAt: Date,
  aiScore: { overall: Number, priceScore: Number, locationScore: Number, roiPotential: Number },
  environmentScore: { overall: Number, aqi: Number, aqiLabel: String, greenCover: Number },
  status: Enum ['available', 'pending', 'sold', 'draft']
}
```

---

## 5. API ROUTE CATALOG

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/agents/profile` | Parichay Buyer Persona Profiling |
| `POST` | `/api/agents/valuation` | Valuation & ROI Specialist Audit |
| `POST` | `/api/agents/geospatial` | GeoSpatial & Environmental Health Audit |
| `POST` | `/api/agents/negotiate` | Financial Negotiation & EMI Strategy |
| `POST` | `/api/agents/debate` | Multi-Agent Consensus Debate Engine |
| `POST` | `/api/agents/scrape/search` | Autonomous Live Portal Scraper |
| `POST` | `/api/agents/scrape/sync/:id` | Single Property Live Sync Verification |

---

## 6. SOURCE CODE EXCERPT FOR COPYRIGHT FILING

*(Extract of Core Agent Debate Algorithm - `backend/src/agents/AgentDebateOrchestrator.js`)*

```javascript
const Groq = require('groq-sdk');
const ValuationROIAgent = require('./ValuationROIAgent');
const GeoSpatialAgent = require('./GeoSpatialAgent');
const NegotiationAgent = require('./NegotiationAgent');

class AgentDebateOrchestrator {
  static async runDebate({ properties, buyerPreferences }) {
    // 1. Gather audits from specialized agents in parallel
    const agentAudits = await Promise.all(
      properties.map(async (prop) => {
        const valuation = await ValuationROIAgent.evaluateProperty(prop);
        const geospatial = await GeoSpatialAgent.evaluateLocation(prop);
        const negotiation = await NegotiationAgent.strategizeDeal({ property: prop, buyerBudget: buyerPreferences?.budget });
        return { propertyId: prop._id || prop.title, title: prop.title, valuation, geospatial, negotiation };
      })
    );

    // 2. Synthesize multi-agent debate and consensus matrix
    const consensus = this.synthesizeConsensus(agentAudits, buyerPreferences);
    return { agentAudits, consensus };
  }
}
module.exports = AgentDebateOrchestrator;
```
