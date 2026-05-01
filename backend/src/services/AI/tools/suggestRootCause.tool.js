import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { rootCauseService } from "../services/ai.service.js";

export const rootCauseTool = tool(
  async ({ description }) => {
    const result = await rootCauseService({ description });
    return JSON.stringify(result);
  },
  {
    name: "suggest_root_cause",
    description: "Suggest possible root causes of an incident",
    schema: z.object({
      description: z.string(),
    }),
  }
);
