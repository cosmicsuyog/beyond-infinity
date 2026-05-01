import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { msgModel } from "./ai.models.js";
import {
  messageModelSystemMessage,
  tagExtractionSystemMessage,
  assignmentSupportSystemMessage,
  incidentSummarySystemMessage,
  rootCauseSuggestionSystemMessage,
  severityClassificationSystemMessage,
} from "./ai.systemMessage.js";

/**
 * Convert raw messages → Langchain format
 */
const formatMessages = (messages = []) => {
  if (!Array.isArray(messages)) {
    throw new Error("Invalid messages format");
  }

  return messages
    .filter((msg) => msg?.content?.trim()) // remove empty
    .map((msg) => {
      switch (msg.role) {
        case "user":
          return new HumanMessage(msg.content.trim());

        case "assistant":
          return new AIMessage(msg.content.trim());

        case "system":
          return new SystemMessage(msg.content.trim());

        default:
          throw new Error(`Invalid role: ${msg.role}`);
      }
    });
};

/**
 * Send messages to AI
 */
export const sendMessageToAI = async (messages) => {
  try {
    const formattedMessages = formatMessages(messages);

    const response = await msgModel.invoke([
      new SystemMessage(messageModelSystemMessage),
      ...formattedMessages,
    ]);

    const output = response?.content?.trim();

    if (!output) {
      throw new Error("Empty AI response");
    }

    return output;
  } catch (error) {
    console.error("❌ AI Message Error:", error.message);
    throw new Error("Failed to generate AI response");
  }
};

/**
 * tagExtractionSystem
 */
export const sendTagExtractionRequest = async (messages) => {
  try {
    const formattedMessages = formatMessages(messages);

    const response = await tagModel.invoke([
      new SystemMessage(tagExtractionSystemMessage),
      ...formattedMessages,
    ]);

    const output = response?.content?.trim();

    if (!output) {
      throw new Error("Empty AI response");
    }

    return output;
  } catch (error) {
    console.error("❌ AI Tag Extraction Error:", error.message);
    throw new Error("Failed to extract tags from AI");
  }
};

/**
 * assignmentSupportSystem
 */
export const sendAssignmentSupportRequest = async (messages) => {
  try {
    const formattedMessages = formatMessages(messages);

    const response = await assignmentModel.invoke([
      new SystemMessage(assignmentSupportSystemMessage),
      ...formattedMessages,
    ]);

    const output = response?.content?.trim();

    if (!output) {
      throw new Error("Empty AI response");
    }

    return output;
  } catch (error) {
    console.error("❌ AI Assignment Support Error:", error.message);
    throw new Error("Failed to get assignment support from AI");
  }
};

/**
 * incidentSummarySystem
 */
export const sendIncidentSummaryRequest = async (messages) => {
  try {
    const formattedMessages = formatMessages(messages);

    const response = await summaryModel.invoke([
      new SystemMessage(incidentSummarySystemMessage),
      ...formattedMessages,
    ]);

    const output = response?.content?.trim();

    if (!output) {
      throw new Error("Empty AI response");
    }

    return output;
  } catch (error) {
    console.error("❌ AI Incident Summary Error:", error.message);
    throw new Error("Failed to get incident summary from AI");
  }
};

/**
 * rootCauseSuggestionSystem
 */
export const sendRootCauseSuggestionRequest = async (messages) => {
  try {
    const formattedMessages = formatMessages(messages);

    const response = await rootCauseModel.invoke([
      new SystemMessage(rootCauseSuggestionSystemMessage),
      ...formattedMessages,
    ]);

    const output = response?.content?.trim();

    if (!output) {
      throw new Error("Empty AI response");
    }

    return output;
  } catch (error) {
    console.error("❌ AI Root Cause Suggestion Error:", error.message);
    throw new Error("Failed to get root cause suggestions from AI");
  }
};

/**
 * severityClassificationSystem
 */
export const sendSeverityClassificationRequest = async (messages) => {
  try {
    const formattedMessages = formatMessages(messages);

    const response = await severityModel.invoke([
      new SystemMessage(severityClassificationSystemMessage),
      ...formattedMessages,
    ]);

    const output = response?.content?.trim();

    if (!output) {
      throw new Error("Empty AI response");
    }

    return output;
  } catch (error) {
    console.error("❌ AI Severity Classification Error:", error.message);
    throw new Error("Failed to classify severity from AI");
  }
};
