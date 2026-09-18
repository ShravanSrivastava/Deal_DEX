/**
 * src/services/ai.service.js
 *
 * Responsibility (and ONLY responsibility):
 *   - Receive review/product text
 *   - Call the AI API/model
 *   - Return sentiment info in a predictable, normalized shape
 *
 * This file must never:
 *   - Touch req/res objects
 *   - Talk to the database
 *   - Contain route/controller logic
 *
 * Controllers should look like:
 *   const { analyzeSentiment } = require('../services/ai.service');
 *   const result = await analyzeSentiment(review.text);
 *   res.json(result);
 */

const axios = require('axios');

// ---- Config -----------------------------------------------------------
const AI_MODEL = process.env.AI_MODEL || 'gemini-2.0-flash';
const AI_API_KEY = process.env.GEMINI_API_KEY;
const AI_API_URL =
  process.env.AI_API_URL ||
  `https://generativelanguage.googleapis.com/v1beta/models/${AI_MODEL}:generateContent`;
const REQUEST_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS) || 10000;

// ---- Public shape -------------------------------------------------------
// {
//   sentiment: 'positive' | 'neutral' | 'negative',
//   score: number,        // -1 (very negative) to 1 (very positive)
//   confidence: number,   // 0 to 1
//   summary: string,      // one-line human-readable summary
//   raw: object | null    // original provider payload, for debugging/logging
// }

const VALID_SENTIMENTS = ['positive', 'neutral', 'negative'];

const SYSTEM_INSTRUCTION =
  'You are a sentiment analysis engine for e-commerce product reviews. ' +
  'Given a review or product description, respond with STRICT JSON only, ' +
  'no markdown, no commentary, matching exactly this schema: ' +
  '{"sentiment":"positive|neutral|negative","score":number(-1 to 1),' +
  '"confidence":number(0 to 1),"summary":string(<=20 words)}';

function buildGeminiPayload(text) {
  return {
    system_instruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text }],
      },
    ],
    generationConfig: {
      temperature: 0,
      responseMimeType: 'application/json',
    },
  };
}

function normalizeParsedResult(parsed, rawResponse) {
  const sentiment = VALID_SENTIMENTS.includes(parsed.sentiment)
    ? parsed.sentiment
    : 'neutral';

  const score = clamp(Number(parsed.score) || 0, -1, 1);
  const confidence = clamp(Number(parsed.confidence) || 0, 0, 1);
  const summary =
    typeof parsed.summary === 'string' && parsed.summary.trim()
      ? parsed.summary.trim()
      : 'No summary available.';

  return { sentiment, score, confidence, summary, raw: rawResponse };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function fallbackResult(reason) {
  return {
    sentiment: 'neutral',
    score: 0,
    confidence: 0,
    summary: `Sentiment unavailable: ${reason}`,
    raw: null,
  };
}

async function analyzeSentiment(text) {
  if (typeof text !== 'string') {
    throw new TypeError('analyzeSentiment expects a string');
  }

  const trimmed = text.trim();
  if (!trimmed) {
    return fallbackResult('empty input');
  }

  if (!AI_API_KEY) {
    console.error('[ai.service] GEMINI_API_KEY is missing/empty. process.env.GEMINI_API_KEY =', JSON.stringify(process.env.GEMINI_API_KEY))
    return fallbackResult('GEMINI_API_KEY not configured');
  }

  try {
    const response = await axios.post(
      AI_API_URL,
      buildGeminiPayload(trimmed),
      {
        headers: {
          'x-goog-api-key': AI_API_KEY,
          'Content-Type': 'application/json',
        },
        timeout: REQUEST_TIMEOUT_MS,
      }
    );

    const content =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      return fallbackResult('empty model response');
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (_err) {
      return fallbackResult('malformed model response');
    }

   return normalizeParsedResult(parsed, response.data);
  } catch (err) {
    const reason = err.response
      ? `AI API error (${err.response.status})`
      : err.code === 'ECONNABORTED'
      ? 'AI API timeout'
      : 'AI API request failed';
      console.error('[ai.service] Gemini call failed:', reason, err.response?.data || err.message);
    return fallbackResult(reason);
  }
}

async function analyzeSentimentBatch(texts) {
  if (!Array.isArray(texts)) {
    throw new TypeError('analyzeSentimentBatch expects an array of strings');
  }
  // Sequential (not parallel) to stay under free-tier rate limits.
  const results = [];
  for (const text of texts) {
    results.push(await analyzeSentiment(text));
    await new Promise((resolve) => setTimeout(resolve, 1200));
  }
  return results;
}

module.exports = {
  analyzeSentiment,
  analyzeSentimentBatch,
};