/**
 * Assignment Engine Service
 * Scores responders and selects best match for incident
 * Uses skill matching + workload + performance scoring
 */

import { ASSIGNMENT_CONFIG } from "../../constants/incident.constants.js";

/**
 * Score and assign incident to best responder
 * Filters by role, calculates composite score
 *
 * @param {object} params
 * @param {Array} params.responders - Array of user objects with skills, activeIncidents
 * @param {Array} params.incidentTags - Tags from incident (e.g., ["database", "api"])
 * @returns {Promise<{selectedResponder: object, scores: Array, recommendation: string}>}
 *
 * @example
 * const result = await assignResponder({
 *   responders: [
 *     { _id: "1", skills: ["database", "payment"], activeIncidents: 2, performanceScore: 0.85 },
 *     { _id: "2", skills: ["frontend"], activeIncidents: 5, performanceScore: 0.70 }
 *   ],
 *   incidentTags: ["database", "api"]
 * });
 * // Result: { selectedResponder: responder1, scores: [...], recommendation: "..." }
 */
export const scoreAndAssignResponder = async ({ responders, incidentTags }) => {
  try {
    if (!Array.isArray(responders) || responders.length === 0) {
      return {
        selectedResponder: null,
        scores: [],
        recommendation: "No available responders",
      };
    }

    if (!Array.isArray(incidentTags)) {
      incidentTags = [];
    }

    // ===== Calculate scores for each responder =====
    const scores = responders.map((responder) => {
      const score = calculateResponderScore(responder, incidentTags);
      return {
        responderId: responder._id,
        responderName: responder.name,
        score,
        breakdown: score.breakdown,
      };
    });

    // ===== Sort by score descending =====
    scores.sort((a, b) => b.score.total - a.score.total);

    // ===== Select best or fallback =====
    const bestScore = scores[0];
    let selectedResponder = null;

    if (bestScore && bestScore.score.total > 0) {
      selectedResponder = responders.find(
        (r) => r._id.toString() === bestScore.responderId.toString()
      );
    } else if (responders.length > 0) {
      // Fallback: select responder with lowest active incidents
      const sorted = [...responders].sort(
        (a, b) => (a.activeIncidents || 0) - (b.activeIncidents || 0)
      );
      selectedResponder = sorted[0];
    }

    return {
      selectedResponder,
      scores,
      recommendation: generateRecommendation(bestScore, selectedResponder),
    };
  } catch (err) {
    console.error("❌ Score And Assign Responder Error:", err.message);
    throw err;
  }
};

/**
 * Calculate composite score for a responder
 * Uses weighted formula:
 * score = (skillMatch × 40) - (workload × 30) + (performance × 20) + (availability × 10)
 *
 * @private
 */
const calculateResponderScore = (responder, incidentTags) => {
  // 1️⃣ SKILL MATCH SCORE (0-40)
  const skillMatchScore = calculateSkillMatch(responder.skills || [], incidentTags);

  // 2️⃣ WORKLOAD SCORE (0-30 deduction)
  const workloadScore = calculateWorkloadScore(responder.activeIncidents || 0);

  // 3️⃣ PERFORMANCE SCORE (0-20)
  const performanceScore =
    (responder.performanceScore || 0.5) * ASSIGNMENT_CONFIG.PERFORMANCE_WEIGHT;

  // 4️⃣ AVAILABILITY BONUS (0-10)
  const availabilityBonus = responder.available ? ASSIGNMENT_CONFIG.AVAILABILITY_WEIGHT : 0;

  // TOTAL SCORE
  const total = skillMatchScore + workloadScore + performanceScore + availabilityBonus;

  return {
    total: Math.max(0, total), // Prevent negative scores
    breakdown: {
      skillMatch: skillMatchScore,
      workload: workloadScore,
      performance: performanceScore,
      availability: availabilityBonus,
    },
  };
};

/**
 * Calculate skill match score (0-40 points)
 * More matched skills = higher score
 * @private
 */
const calculateSkillMatch = (responderSkills, incidentTags) => {
  if (!incidentTags || incidentTags.length === 0) {
    return 0; // No tags to match
  }

  const normalizedSkills = (responderSkills || []).map((s) => String(s).toLowerCase());
  const normalizedTags = incidentTags.map((t) => String(t).toLowerCase());

  // Count matches
  const matches = normalizedTags.filter((tag) => normalizedSkills.includes(tag)).length;

  // Ratio of matched tags
  const matchRatio = matches / normalizedTags.length; // 0 to 1

  return matchRatio * ASSIGNMENT_CONFIG.SKILL_MATCH_WEIGHT; // 0 to 40
};

/**
 * Calculate workload penalty (0 to -30 points)
 * More incidents = bigger penalty
 * @private
 */
const calculateWorkloadScore = (activeIncidents) => {
  const maxCapacity = ASSIGNMENT_CONFIG.MAX_INCIDENTS_PER_RESPONDER || 10;

  // Prevent division by zero
  if (maxCapacity <= 0) return 0;

  const workloadRatio = Math.min(activeIncidents / maxCapacity, 1); // 0 to 1
  const penalty = workloadRatio * Math.abs(ASSIGNMENT_CONFIG.WORKLOAD_WEIGHT); // 0 to 30

  return -penalty; // Negative (penalty)
};

/**
 * Get responders available for assignment
 * Filters by role (responder/admin) and availability
 *
 * @param {Array} users - Array of user objects
 * @returns {Array} Filtered responders
 */
export const getAvailableResponders = (users) => {
  if (!Array.isArray(users)) return [];

  return users.filter((user) => {
    // Must be responder or admin
    const validRole = user.role === "responder" || user.role === "admin";

    // Must be available
    const isAvailable = user.available !== false; // Default to available if not set

    // Must not be deleted
    const isActive = user.isActive !== false; // Default to active if not set

    return validRole && isAvailable && isActive;
  });
};

/**
 * Generate human-readable recommendation
 * @private
 */
const generateRecommendation = (bestScore, selectedResponder) => {
  if (!selectedResponder) {
    return "⚠️  No responder available. Assigning to admin queue.";
  }

  if (!bestScore || bestScore.score.total <= 0) {
    return `Assigned to ${selectedResponder.name} (lowest workload fallback)`;
  }

  const skillMatch = bestScore.score.breakdown?.skillMatch || 0;
  if (skillMatch > 30) {
    return `✅ ${selectedResponder.name} - Excellent skill match (${skillMatch.toFixed(0)} pts)`;
  } else if (skillMatch > 15) {
    return `✅ ${selectedResponder.name} - Good skill match (${skillMatch.toFixed(0)} pts)`;
  } else {
    return `✅ ${selectedResponder.name} - Assigned (${bestScore.score.total.toFixed(0)} pts)`;
  }
};

/**
 * Validate responder assignment
 * Checks if responder is eligible for incident
 *
 * @param {object} responder - User object to assign
 * @param {string} incidentSeverity - Incident severity level
 * @returns {boolean}
 */
export const isResponderEligible = (responder, incidentSeverity) => {
  if (!responder) return false;

  // Must be active
  if (responder.isActive === false) return false;

  // Must be available
  if (responder.available === false) return false;

  // Admin can handle any severity
  if (responder.role === "admin") return true;

  // Responders can handle all but critical (critical needs admin)
  if (responder.role === "responder" && incidentSeverity !== "critical") return true;

  return false;
};

export default {
  scoreAndAssignResponder,
  getAvailableResponders,
  isResponderEligible,
};
