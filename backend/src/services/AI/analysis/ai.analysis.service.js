/**
 * AI Analysis Service
 * Orchestrates incident analysis via AI Agent
 * Ensures single AI call per incident (efficiency)
 * Handles JSON parsing failures gracefully
 */

import { analyzeIncident } from "../agent/ai.agent.js";
import { ALLOWED_INCIDENT_TAGS } from "../../../constants/incident.constants.js";

/**
 * Analyze incident description once
 * Extracts tags, summary, severity, and root causes
 * Filters invalid tags and provides fallbacks
 *
 * @param {object} params
 * @param {string} params.description - Error/incident description
 * @returns {Promise<{summary: string, tags: Array, severity: string, possibleCauses: Array, confidence: number}>}
 *
 * @example
 * const analysis = await analyzeIncidentOnce({
 *   description: "Payment service timeout after database migration"
 * });
 * // Returns structured analysis safe for storage
 */
export const analyzeIncidentOnce = async ({ description }) => {
  if (!description) {
    throw new Error("description is required");
  }

  try {
    // Single AI call - runs all analyses in parallel internally
    const aiResponse = await analyzeIncident({ description });

    // Extract and validate results with fallbacks
    const summary = extractSummary(aiResponse.summary);
    const tags = extractAndFilterTags(aiResponse.tags);
    const severity = extractSeverity(aiResponse.severity);
    const possibleCauses = extractPossibleCauses(aiResponse.rootCause);

    // Calculate confidence based on parse success rate
    const parseSuccesses = [
      !aiResponse.summary?.parseError,
      !aiResponse.tags?.parseError,
      !aiResponse.severity?.parseError,
      !aiResponse.rootCause?.parseError,
    ].filter(Boolean).length;

    const confidence = parseSuccesses / 4; // 0.75 = 75% success

    return {
      summary,
      tags,
      severity,
      possibleCauses,
      confidence,
      analyzedAt: new Date().toISOString(),
      raw: aiResponse, // Store raw for debugging
    };
  } catch (err) {
    console.error("❌ AI Analysis Service Error:", err.message);

    // Provide minimal fallback to prevent incident creation failure
    return {
      summary: description.substring(0, 200),
      tags: [],
      severity: "medium", // Default to medium
      possibleCauses: ["Unable to determine from AI analysis"],
      confidence: 0,
      error: err.message,
      analyzedAt: new Date().toISOString(),
    };
  }
};

/**
 * Extract and validate summary
 * @private
 */
const extractSummary = (summaryData) => {
  try {
    if (!summaryData || summaryData.error) return null;

    // Handle both direct string and object with summary property
    const summary =
      typeof summaryData.summary === "string"
        ? summaryData.summary
        : typeof summaryData === "string"
          ? summaryData
          : null;

    if (summary && summary.length > 0 && summary.length <= 500) {
      return summary.trim();
    }

    return null;
  } catch (err) {
    console.warn("⚠️  Summary extraction failed:", err.message);
    return null;
  }
};

/**
 * Extract and filter tags
 * Only keeps allowed tags from constants
 * @private
 */
const extractAndFilterTags = (tagsData) => {
  try {
    if (!tagsData || tagsData.error) return [];

    // Handle array or object with tags property
    let tagsArray = Array.isArray(tagsData) ? tagsData : tagsData.tags || [];

    if (!Array.isArray(tagsArray)) {
      tagsArray = [];
    }

    // Normalize: lowercase, trim, filter valid
    const normalized = tagsArray
      .map((tag) => String(tag).toLowerCase().trim())
      .filter((tag) => ALLOWED_INCIDENT_TAGS.includes(tag))
      .filter((tag, index, arr) => arr.indexOf(tag) === index); // Remove duplicates

    // Max 3 tags per incident
    return normalized.slice(0, 3);
  } catch (err) {
    console.warn("⚠️  Tag extraction failed:", err.message);
    return [];
  }
};

/**
 * Extract and validate severity
 * Only accepts allowed severity levels
 * @private
 */
const extractSeverity = (severityData) => {
  try {
    if (!severityData || severityData.error) return "medium";

    // Handle both direct string and object with severity property
    const sev =
      typeof severityData.severity === "string"
        ? severityData.severity
        : typeof severityData === "string"
          ? severityData
          : null;

    const lowerSev = sev?.toLowerCase().trim();
    const validSeverities = ["low", "medium", "high", "critical"];

    if (validSeverities.includes(lowerSev)) {
      return lowerSev;
    }

    return "medium"; // Default fallback
  } catch (err) {
    console.warn("⚠️  Severity extraction failed:", err.message);
    return "medium";
  }
};

/**
 * Extract possible causes
 * Returns array of cause strings
 * @private
 */
const extractPossibleCauses = (causesData) => {
  try {
    if (!causesData || causesData.error) return [];

    // Handle array or object with possibleCauses property
    let causes = Array.isArray(causesData) ? causesData : causesData.possibleCauses || [];

    if (!Array.isArray(causes)) {
      causes = [];
    }

    // Convert to strings, trim, filter empty
    const cleaned = causes
      .map((cause) => String(cause).trim())
      .filter((cause) => cause.length > 0 && cause.length <= 500);

    // Max 5 causes per incident
    return cleaned.slice(0, 5);
  } catch (err) {
    console.warn("⚠️  Cause extraction failed:", err.message);
    return [];
  }
};

/**
 * Validate analysis result
 * Checks if AI analysis is complete and valid
 * @private
 */
export const isAnalysisValid = (analysis) => {
  // Must have at least one of these
  const hasSummary = analysis.summary && analysis.summary.length > 0;
  const hasTags = analysis.tags && analysis.tags.length > 0;
  const hasSeverity = analysis.severity && analysis.severity.length > 0;

  return hasSummary || hasTags || hasSeverity;
};

export default {
  analyzeIncidentOnce,
  isAnalysisValid,
};
