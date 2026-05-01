/**
 * AI Agent Wrapper
 * Exposes AI analysis capabilities as consumable services
 * Handles safe JSON parsing and error fallbacks
 *
 * Single-call pattern: analyzeIncident() runs all AI analyses in parallel
 */

import {
  sendTagExtractionRequest,
  sendIncidentSummaryRequest,
  sendRootCauseSuggestionRequest,
  sendSeverityClassificationRequest,
  sendMessageToAI,
} from "../ai.service.js";

/**
 * Convert string to user message format
 * @private
 */
const toUserMessage = (text) => [{ role: "user", content: String(text || "").trim() }];

/**
 * Safe JSON parse with fallback
 * If parsing fails, returns object with raw string
 * @private
 */
const safeParse = (str) => {
  try {
    return JSON.parse(str);
  } catch (err) {
    console.warn("⚠️  JSON parse failed, returning raw response:", err.message);
    return { raw: String(str), parseError: true };
  }
};

/**
 * Extract tags from incident description
 * Returns: { tags: ["tag1", "tag2"], parseError?: boolean }
 */
export const extractTagsService = async ({ description }) => {
  if (!description) {
    throw new Error("description is required");
  }

  try {
    const output = await sendTagExtractionRequest(toUserMessage(description));
    return safeParse(output);
  } catch (err) {
    console.error("❌ Extract Tags Error:", err.message);
    throw err;
  }
};

/**
 * Generate summary from incident description
 * Returns: { summary: "short summary", parseError?: boolean }
 */
export const generateSummaryService = async ({ description }) => {
  if (!description) {
    throw new Error("description is required");
  }

  try {
    const output = await sendIncidentSummaryRequest(toUserMessage(description));
    return safeParse(output);
  } catch (err) {
    console.error("❌ Generate Summary Error:", err.message);
    throw err;
  }
};

/**
 * Get root cause suggestions for incident
 * Returns: { possibleCauses: ["cause1", "cause2"], parseError?: boolean }
 */
export const rootCauseService = async ({ description }) => {
  if (!description) {
    throw new Error("description is required");
  }

  try {
    const output = await sendRootCauseSuggestionRequest(toUserMessage(description));
    return safeParse(output);
  } catch (err) {
    console.error("❌ Root Cause Service Error:", err.message);
    throw err;
  }
};

/**
 * Classify incident severity
 * Returns: { severity: "low|medium|high|critical", parseError?: boolean }
 */
export const severityService = async ({ description }) => {
  if (!description) {
    throw new Error("description is required");
  }

  try {
    const output = await sendSeverityClassificationRequest(toUserMessage(description));
    return safeParse(output);
  } catch (err) {
    console.error("❌ Severity Service Error:", err.message);
    throw err;
  }
};

/**
 * Core: Analyze incident with single AI call
 * Runs all analyses in parallel for efficiency
 * Returns combined results from tags, summary, root causes, severity
 *
 * @param {object} params
 * @param {string} params.description - Error/incident description
 * @returns {Promise<{tags, summary, rootCause, severity}>}
 *
 * @example
 * const analysis = await analyzeIncident({
 *   description: "Database connection timeout on payment service"
 * });
 * // Returns: {
 * //   tags: { tags: ["database", "payment"], parseError?: false },
 * //   summary: { summary: "Payment DB timeout", parseError?: false },
 * //   rootCause: { possibleCauses: [...], parseError?: false },
 * //   severity: { severity: "high", parseError?: false }
 * // }
 */
export const analyzeIncident = async ({ description }) => {
  if (!description) {
    throw new Error("description is required");
  }

  try {
    // Run all AI analyses in parallel
    // Failures in one don't block others (graceful degradation)
    const [tags, summary, rootCause, severity] = await Promise.all([
      extractTagsService({ description }).catch((e) => ({
        error: e.message,
        parseError: true,
      })),
      generateSummaryService({ description }).catch((e) => ({
        error: e.message,
        parseError: true,
      })),
      rootCauseService({ description }).catch((e) => ({
        error: e.message,
        parseError: true,
      })),
      severityService({ description }).catch((e) => ({
        error: e.message,
        parseError: true,
      })),
    ]);

    return {
      tags,
      summary,
      rootCause,
      severity,
      analyzedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error("❌ Analyze Incident Error:", err.message);
    throw err;
  }
};

/**
 * Generic conversational entrypoint
 * Accepts array of messages or single string
 * Uses general-purpose msgModel
 *
 * @param {string|Array} input - Single message string or array of {role, content}
 * @returns {Promise<string>} Raw AI response
 */
export const converse = async (input) => {
  try {
    const messages = Array.isArray(input) ? input : toUserMessage(input);
    const output = await sendMessageToAI(messages);
    return String(output || "");
  } catch (err) {
    console.error("❌ Converse Error:", err.message);
    throw err;
  }
};

/**
 * Export all functions as default
 */
export default {
  extractTagsService,
  generateSummaryService,
  rootCauseService,
  severityService,
  analyzeIncident,
  converse,
};
