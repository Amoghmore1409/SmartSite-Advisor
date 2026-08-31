const Groq = require('groq-sdk');

const groqApiKey = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: groqApiKey || 'placeholder_for_no_key' });

/**
 * Helper to execute Groq LLM completions with fallback models
 */
async function callGroqAgent({ systemPrompt, userPrompt, temperature = 0.5, maxTokens = 1000 }) {
  // The previous model names (llama-3.3-70b-versatile, llama-3.1-8b-instant,
  // mixtral-8x7b-32768) are all dead on Groq now — two return 404 "model not found"
  // and the third is explicitly decommissioned — so every call here was silently
  // failing and every caller fell back to hardcoded static content. Verified these
  // two actually respond via groq.models.list() + live chat.completions.create() calls,
  // and reliably follow "return only JSON" instructions (groq/compound was also live
  // but frequently ignored strict-JSON instructions in favor of markdown prose).
  const models = ['qwen/qwen3.8-27b', 'groq/compound-mini'];

  for (const model of models) {
    try {
      const response = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        model: model,
        temperature: temperature,
        max_tokens: maxTokens,
      });

      const content = response.choices[0]?.message?.content;
      if (content) return content;
    } catch (err) {
      console.warn(`Groq model ${model} failed, trying fallback model...`, err.message);
    }
  }

  throw new Error('All Groq models failed to return a response.');
}

module.exports = {
  groq,
  callGroqAgent
};
