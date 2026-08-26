const Groq = require('groq-sdk');

const groqApiKey = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: groqApiKey || 'placeholder_for_no_key' });

/**
 * Helper to execute Groq LLM completions with fallback models
 */
async function callGroqAgent({ systemPrompt, userPrompt, temperature = 0.5, maxTokens = 1000 }) {
  const models = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'];

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
