import "dotenv/config";

/**
 * Required ENV checker
 */
const requireEnv = (key) => {
  const value = process.env[key];

  if (!value || value.trim() === "") {
    throw new Error(`❌ Missing required ENV variable: ${key}`);
  }

  return value.trim();
};

/**
 * Optional ENV
 */
const optionalEnv = (key, defaultValue = null) => {
  const value = process.env[key];
  return value && value.trim() !== "" ? value.trim() : defaultValue;
};

/**
 * Convert to number safely
 */
const toNumber = (value, key) => {
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`❌ ENV ${key} must be a number`);
  }
  return num;
};

/**
 * Central ENV object
 */
export const ENV = Object.freeze({
  // ===== App Config =====
  PORT: toNumber(optionalEnv("PORT", 3000), "PORT"),
  NODE_ENV: optionalEnv("NODE_ENV", "development"),

  // ===== Database =====
  MONGO_URI: requireEnv("MONGO_URI"),

  // ===== Auth =====
  JWT_SECRET: requireEnv("JWT_SECRET"),

  // ===== CORS =====
  CORS_ORIGIN: optionalEnv("CORS_ORIGIN", "http://localhost:3000"),

  // ===== Redis =====
  REDIS: {
    // USERNAME: optionalEnv("REDIS_USERNAME", "default"),
    HOST: requireEnv("REDIS_HOST"),
    PORT: toNumber(requireEnv("REDIS_PORT"), "REDIS_PORT"),
    PASSWORD: requireEnv("REDIS_PASSWORD"),
  },

  // ===== Mail (Resend) =====
  MAIL: {
    API_KEY: requireEnv("RESEND_MAIL_API_KEY"),
    FROM: requireEnv("RESEND_MAIL_FROM"),
  },

  // ===== GROQ AI =====
  GROQ_API_KEY: requireEnv("GROQ_API_KEY"),

  // ===== Aggregation Engine =====
  AGGREGATION: {
    THRESHOLD_LOW: toNumber(
      optionalEnv("AGGREGATION_THRESHOLD_LOW", 5),
      "AGGREGATION_THRESHOLD_LOW"
    ),
    THRESHOLD_MEDIUM: toNumber(
      optionalEnv("AGGREGATION_THRESHOLD_MEDIUM", 10),
      "AGGREGATION_THRESHOLD_MEDIUM"
    ),
    THRESHOLD_HIGH: toNumber(
      optionalEnv("AGGREGATION_THRESHOLD_HIGH", 20),
      "AGGREGATION_THRESHOLD_HIGH"
    ),
    THRESHOLD_CRITICAL: toNumber(
      optionalEnv("AGGREGATION_THRESHOLD_CRITICAL", 50),
      "AGGREGATION_THRESHOLD_CRITICAL"
    ),
    WINDOW_SECONDS: toNumber(
      optionalEnv("AGGREGATION_WINDOW_SECONDS", 3600),
      "AGGREGATION_WINDOW_SECONDS"
    ), // 1 hour
  },
});
