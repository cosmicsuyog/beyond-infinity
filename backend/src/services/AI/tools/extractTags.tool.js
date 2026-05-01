import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { extractTagsService } from "../services/ai.service.js";

export const extractTagsTool = tool(
  async ({ description }) => {
    const result = await extractTagsService({ description });
    return JSON.stringify(result);
  },
  {
    name: "extract_tags",
    description: "Extract technical tags from an incident description like payment, database, api",

    schema: z.object({
      description: z.string().describe("Incident description"),
    }),
  }
);
