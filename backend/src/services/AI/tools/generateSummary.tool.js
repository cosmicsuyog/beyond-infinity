import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { generateSummaryService } from "../services/ai.service.js";

export const summaryTool = tool(
  async ({ description }) => {
    const result = await generateSummaryService({ description });
    return JSON.stringify(result);
  },
  {
    name: "generate_summary",
    description: "Generate a short summary of an incident",
    schema: z.object({
      description: z.string(),
    }),
  }
);
