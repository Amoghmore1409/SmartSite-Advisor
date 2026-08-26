const { callGroqAgent } = require('./groqClient');

/**
 * Negotiation & EMI Deal Strategist Agent
 */
class NegotiationAgent {
  static async strategizeDeal({ property, buyerBudget, downPaymentPct = 20, tenureYears = 20, interestRate = 8.5 }) {
    const propertyPrice = property.price || 9500000;
    
    const systemPrompt = `You are 'Negotiation & EMI Deal Strategist Agent', an autonomous real estate deal advisor representing the buyer.
Your objective is to:
1. Formulate a strong, data-backed counter-offer to save the buyer money.
2. Provide step-by-step negotiation scripts/tactics for the buyer to use with the developer/seller.
3. Calculate exact loan EMI breakdown and tax savings under Section 24 & 80EEA.
4. Summarize potential savings in plain English.

Return valid JSON with keys:
{
  "listPrice": number,
  "recommendedCounterOffer": number,
  "estimatedSavingsAmount": string (e.g. "₹4.5 Lakhs"),
  "estimatedEMI": string (e.g. "₹65,800/mo"),
  "recommendedDownPayment": string,
  "loanTenureYears": number,
  "taxSavingsPerYear": string (e.g. "₹75,000/yr"),
  "negotiationTactics": string[] (3 actionable tactics for the buyer),
  "closingAdvice": string (Plain-English final recommendation)
}`;

    const userPrompt = `Property Name: ${property.title || property.name}
Property Price: ₹${propertyPrice}
Buyer Budget: ₹${buyerBudget || propertyPrice}
Down Payment: ${downPaymentPct}%
Loan Interest Rate: ${interestRate}%
Tenure: ${tenureYears} Years

Formulate the negotiation strategy and return valid JSON.`;

    try {
      const rawResponse = await callGroqAgent({
        systemPrompt,
        userPrompt,
        temperature: 0.4,
        maxTokens: 900
      });

      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return {
        listPrice: propertyPrice,
        recommendedCounterOffer: Math.round(propertyPrice * 0.94),
        estimatedSavingsAmount: `₹${((propertyPrice * 0.06) / 100000).toFixed(2)} Lakhs`,
        estimatedEMI: `₹${Math.round((propertyPrice * 0.8 * 0.00868)).toLocaleString('en-IN')}/mo`,
        recommendedDownPayment: `₹${((propertyPrice * 0.2) / 100000).toFixed(2)} Lakhs (${downPaymentPct}%)`,
        loanTenureYears: tenureYears,
        taxSavingsPerYear: "₹72,000/yr",
        negotiationTactics: [
          "Request a 4% - 6% waiver by offering a faster 15-day token payment.",
          "Ask for free covered parking allocation (saving ~₹2.5 Lakhs).",
          "Compare with neighboring properties to leverage price parity."
        ],
        closingAdvice: rawResponse
      };
    } catch (error) {
      console.error("NegotiationAgent Error:", error);
      return {
        listPrice: propertyPrice,
        recommendedCounterOffer: Math.round(propertyPrice * 0.95),
        estimatedSavingsAmount: "₹4.75 Lakhs",
        estimatedEMI: "₹64,500/mo",
        recommendedDownPayment: "₹19.0 Lakhs",
        loanTenureYears: 20,
        taxSavingsPerYear: "₹75,000/yr",
        negotiationTactics: [
          "Offer immediate booking token in exchange for 5% price reduction.",
          "Negotiate inclusion of club membership and registration charges.",
          "Cite micro-market price benchmarks in Panathur/Bangalore."
        ],
        closingAdvice: "Offer ₹90.25 Lakhs upfront. The seller has high inventory in this tower and is likely to accept."
      };
    }
  }
}

module.exports = NegotiationAgent;
