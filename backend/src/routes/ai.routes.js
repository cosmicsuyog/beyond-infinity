import { Router } from "express";
import { generateSummary, extractTags, suggestRootCause } from "../controllers/ai.controller.js";

const router = Router();

router.post("/summary", generateSummary);
router.post("/tags", extractTags);
router.post("/root-cause", suggestRootCause);

export default router;
