const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');

// 1. Parichay Buyer Persona Profiling
router.post('/profile', agentController.profileBuyer);

// 2. Valuation & ROI Specialist Audit
router.post('/valuation', agentController.evaluateValuation);

// 3. GeoSpatial & Environmental Health Audit
router.post('/geospatial', agentController.evaluateGeoSpatial);

// 4. Negotiation & EMI Deal Strategy
router.post('/negotiate', agentController.strategizeNegotiation);

// 5. Constructor Upgrade Action Plan (Seller)
router.post('/upgrade', agentController.evaluateConstructorUpgrade);

// 6. Live Multi-Agent Debate & Consensus Engine
router.post('/debate', agentController.runMultiAgentDebate);

// 7. Live Real Estate Harvester & Scraper Agent
router.post('/scrape/search', agentController.harvestLiveListings);

// 8. On-Demand Property Portal Live Sync
router.post('/scrape/sync/:propertyId', agentController.syncSingleProperty);

module.exports = router;
