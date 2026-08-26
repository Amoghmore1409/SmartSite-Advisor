const { callGroqAgent } = require('./groqClient');

/**
 * Parichay Agent - Buyer Persona & Preference Profiler
 */
class ParichayAgent {
  static async profileBuyer(userQuery, existingPreferences = {}) {
    const systemPrompt = `You are 'Parichay Agent', an autonomous AI Buyer Profiler for SmartSite Advisor real estate.
Your job is to analyze buyer statements, lifestyle goals, or constraints, and extract:
1. Persona Category (e.g., "Tech Professional", "Growing Family", "Yield Investor", "Luxury Seeker")
2. Calculated Weight distribution summing to 100% across:
   - ROI (Investment appreciation)
   - Transit (Commute & Connectivity)
   - Amenities (Comfort, Gym, Pool)
   - EcoHealth (AQI, Parks, Quietness)
3. Budget Range Recommendation
4. Plain-English Summary of what this buyer prioritizes most.

Respond ONLY in valid JSON format with keys:
{
  "personaCategory": string,
  "roiWeight": number,
  "transitWeight": number,
  "amenitiesWeight": number,
  "ecoHealthWeight": number,
  "suggestedBudget": string,
  "plainEnglishSummary": string,
  "recommendedSearchQuery": string
}`;

    const userPrompt = `Buyer input statement: "${userQuery}".
Existing profile: ${JSON.stringify(existingPreferences)}.
Analyze this buyer and return the JSON profile.`;

    try {
      const rawResponse = await callGroqAgent({
        systemPrompt,
        userPrompt,
        temperature: 0.3,
        maxTokens: 800
      });

      // Parse JSON from response
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return {
        personaCategory: "Balanced Buyer",
        roiWeight: 35,
        transitWeight: 25,
        amenitiesWeight: 25,
        ecoHealthWeight: 15,
        suggestedBudget: "₹80 Lakhs - ₹1.5 Cr",
        plainEnglishSummary: rawResponse,
        recommendedSearchQuery: userQuery
      };
    } catch (error) {
      console.error("ParichayAgent Error:", error);
      return {
        personaCategory: "Smart Home Finder",
        roiWeight: 40,
        transitWeight: 30,
        amenitiesWeight: 30,
        ecoHealthWeight: 0,
        suggestedBudget: "₹90 Lakhs - ₹1.8 Cr",
        plainEnglishSummary: "Balanced preference for investment growth and modern amenities.",
        recommendedSearchQuery: userQuery
      };
    }
  }
}

module.exports = ParichayAgent;
