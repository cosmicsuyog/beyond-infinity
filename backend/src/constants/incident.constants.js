/**
 * Incident Management Constants
 * Defines thresholds, statuses, and severity levels
 */

// Incident Status Lifecycle
export const INCIDENT_STATUS = {
  OPEN: "open",
  INVESTIGATING: "investigating",
  IDENTIFIED: "identified",
  RESOLVED: "resolved",
  ARCHIVED: "archived",
};

// Incident Severity Levels
export const INCIDENT_SEVERITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
};

// Aggregation Thresholds (errors before incident creation)
export const AGGREGATION_THRESHOLDS = {
  LOW: 5, // 5 same errors → LOW severity incident
  MEDIUM: 10, // 10 same errors → MEDIUM severity incident
  HIGH: 20, // 20 same errors → HIGH severity incident
  CRITICAL: 50, // 50+ same errors → CRITICAL severity incident
};

// Aggregation Time Window (seconds)
export const AGGREGATION_WINDOW = 3600; // 1 hour - how long to keep error groups alive

// Timeline Event Types
export const TIMELINE_EVENT_TYPES = {
  INCIDENT_CREATED: "incident_created",
  INCIDENT_ASSIGNED: "incident_assigned",
  STATUS_CHANGED: "status_changed",
  USER_ACKNOWLEDGED: "user_acknowledged",
  USER_RESOLVED: "user_resolved",
  COMMENT_ADDED: "comment_added",
  AI_ANALYSIS_RUN: "ai_analysis_run",
  ESCALATED: "escalated",
};

// Error Sources
export const ERROR_SOURCES = {
  API: "api",
  MANUAL: "manual",
  MONITORING: "monitoring",
  AI: "ai",
};

// Allowed Tags (from AI system message)
export const ALLOWED_INCIDENT_TAGS = [
  "payment",
  "database",
  "auth",
  "api",
  "infra",
  "network",
  "frontend",
  "backend",
];

// Default Error Retention (days)
export const ERROR_RETENTION_DAYS = 30;

// Assignment Configuration
export const ASSIGNMENT_CONFIG = {
  MAX_INCIDENTS_PER_RESPONDER: 10,
  SKILL_MATCH_WEIGHT: 40,
  WORKLOAD_WEIGHT: -30,
  PERFORMANCE_WEIGHT: 20,
  AVAILABILITY_WEIGHT: 10,
  FALLBACK_TO_ADMIN: true, // If no responder match, assign to admin
};

// Performance Score Calculation
export const PERFORMANCE_SCORE_CONFIG = {
  RESOLUTION_TIME_WEIGHT: 0.5, // Faster resolution = higher score
  FIRST_RESPONSE_TIME_WEIGHT: 0.3,
  ACCURACY_WEIGHT: 0.2, // Based on resolved incidents
};

// User Roles with Incident Access
export const USER_ROLES_INCIDENT_ACCESS = {
  ADMIN: "admin", // Full access, can assign, resolve, comment
  RESPONDER: "responder", // Can acknowledge, comment, resolve assigned incidents
  VIEWER: "viewer", // Read-only access to dashboard
};

// Service Health Status
export const SERVICE_HEALTH_STATUS = {
  UP: "up",
  DEGRADED: "degraded",
  DOWN: "down",
  UNKNOWN: "unknown",
};
