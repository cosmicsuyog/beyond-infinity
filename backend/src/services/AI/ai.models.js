import { ChatGroq } from "@langchain/groq";
import { ENV } from "../../config/env.config.js";

/**
 * Base config (shared across models)
 */
const baseConfig = {
  apiKey: ENV.GROQ_API_KEY,
  maxRetries: 2,
  timeout: 10000, // 10 sec safety
};

/**
 * Main Chat Model (for conversations)
 */
export const msgModel = new ChatGroq({
  ...baseConfig,
  model: "openai/gpt-oss-120b",

  temperature: 0.7, // balanced creativity
  maxTokens: 1000, // controlled output
});

/***************** Additional Models (if needed) *****************/

/**
 * TAG EXTRACTION MODEL
 */
export const tagModel = new ChatGroq({
  ...baseConfig,
  model: "openai/gpt-oss-120b",

  temperature: 0.3, // more deterministic for tags
  maxTokens: 200, // concise output
});

/**
 * INCIDENT SUMMARY MODEL
 */
export const summaryModel = new ChatGroq({
  ...baseConfig,
  model: "openai/gpt-oss-120b",

  temperature: 0.5, // balanced for summaries
  maxTokens: 500, // focused summaries
});

/**
 * ROOT CAUSE ANALYSIS MODEL
 */
export const rootCauseModel = new ChatGroq({
  ...baseConfig,
  model: "openai/gpt-oss-120b",

  temperature: 0.6, // allow some creativity in analysis
  maxTokens: 800, // detailed analysis
});

/*
 * SEVERITY CLASSIFICATION MODEL
 */
export const severityModel = new ChatGroq({
  ...baseConfig,
  model: "openai/gpt-oss-120b",

  temperature: 0.2, // very deterministic for classification
  maxTokens: 100, // concise output
});

/*
 * ASSIGNMENT SUPPORT MODEL
 */
export const assignmentModel = new ChatGroq({
  ...baseConfig,
  model: "openai/gpt-oss-120b",

  temperature: 0.4, // slightly creative for suggestions
  maxTokens: 300, // focused suggestions
});
