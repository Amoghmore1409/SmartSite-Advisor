const ParichayAgent = require('../agents/ParichayAgent');
const ValuationROIAgent = require('../agents/ValuationROIAgent');
const GeoSpatialAgent = require('../agents/GeoSpatialAgent');
const NegotiationAgent = require('../agents/NegotiationAgent');
const ConstructorUpgradeAgent = require('../agents/ConstructorUpgradeAgent');
const AgentDebateOrchestrator = require('../agents/AgentDebateOrchestrator');
const PortalSyncManager = require('../agents/PortalSyncManager');

/**
 * 1. Parichay Buyer Profiling
 */
exports.profileBuyer = async (req, res) => {
  try {
    const { query, existingPreferences } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Buyer query text is required." });
    }
    const profile = await ParichayAgent.profileBuyer(query, existingPreferences);
    return res.status(200).json({ success: true, agent: "ParichayAgent", data: profile });
  } catch (error) {
    console.error("profileBuyer Error:", error);
    return res.status(500).json({ error: "Failed to generate buyer profile." });
  }
};

/**
 * 2. Valuation & ROI Specialist Audit
 */
exports.evaluateValuation = async (req, res) => {
  try {
    const { property } = req.body;
    if (!property) {
      return res.status(400).json({ error: "Property details required." });
    }
    const audit = await ValuationROIAgent.evaluateProperty(property);
    return res.status(200).json({ success: true, agent: "ValuationROIAgent", data: audit });
  } catch (error) {
    console.error("evaluateValuation Error:", error);
    return res.status(500).json({ error: "Failed to audit property valuation." });
  }
};

/**
 * 3. GeoSpatial & Environmental Health Audit
 */
exports.evaluateGeoSpatial = async (req, res) => {
  try {
    const { property } = req.body;
    if (!property) {
      return res.status(400).json({ error: "Property details required." });
    }
    const audit = await GeoSpatialAgent.evaluateLocation(property);
    return res.status(200).json({ success: true, agent: "GeoSpatialAgent", data: audit });
  } catch (error) {
    console.error("evaluateGeoSpatial Error:", error);
    return res.status(500).json({ error: "Failed to audit location connectivity." });
  }
};

/**
 * 4. Negotiation & EMI Deal Strategy
 */
exports.strategizeNegotiation = async (req, res) => {
  try {
    const { property, buyerBudget, downPaymentPct, tenureYears, interestRate } = req.body;
    if (!property) {
      return res.status(400).json({ error: "Property details required." });
    }
    const strategy = await NegotiationAgent.strategizeDeal({
      property,
      buyerBudget,
      downPaymentPct,
      tenureYears,
      interestRate
    });
    return res.status(200).json({ success: true, agent: "NegotiationAgent", data: strategy });
  } catch (error) {
    console.error("strategizeNegotiation Error:", error);
    return res.status(500).json({ error: "Failed to generate negotiation strategy." });
  }
};

/**
 * 5. Constructor Upgrade Action Plan
 */
exports.evaluateConstructorUpgrade = async (req, res) => {
  try {
    const { property } = req.body;
    if (!property) {
      return res.status(400).json({ error: "Property details required." });
    }
    const plan = await ConstructorUpgradeAgent.evaluateUpgradePlan(property);
    return res.status(200).json({ success: true, agent: "ConstructorUpgradeAgent", data: plan });
  } catch (error) {
    console.error("evaluateConstructorUpgrade Error:", error);
    return res.status(500).json({ error: "Failed to generate upgrade action plan." });
  }
};

/**
 * 6. Live Multi-Agent Debate & Consensus Engine
 */
exports.runMultiAgentDebate = async (req, res) => {
  try {
    const { properties, buyerPreferences } = req.body;
    if (!properties || !Array.isArray(properties) || properties.length === 0) {
      return res.status(400).json({ error: "Array of properties is required." });
    }
    const debate = await AgentDebateOrchestrator.runDebate({ properties, buyerPreferences });
    return res.status(200).json({ success: true, agent: "AgentDebateOrchestrator", data: debate });
  } catch (error) {
    console.error("runMultiAgentDebate Error:", error);
    return res.status(500).json({ error: "Failed to execute multi-agent debate." });
  }
};

/**
 * 7. Live Harvester & Portal Sync Agent
 */
exports.harvestLiveListings = async (req, res) => {
  try {
    const { city, locality, limit } = req.body;
    const syncResult = await PortalSyncManager.harvestAndSyncRegion({ city, locality, limit });
    return res.status(200).json({ success: true, agent: "RealEstateScraperAgent", data: syncResult });
  } catch (error) {
    console.error("harvestLiveListings Error:", error);
    return res.status(500).json({ error: "Failed to harvest live portal listings." });
  }
};

/**
 * 8. On-Demand Single Property Verification Sync
 */
exports.syncSingleProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const syncResult = await PortalSyncManager.forceSinglePropertySync(propertyId);
    return res.status(200).json({ success: true, agent: "PortalSyncManager", data: syncResult });
  } catch (error) {
    console.error("syncSingleProperty Error:", error);
    return res.status(500).json({ error: "Failed to sync property live verification." });
  }
};

