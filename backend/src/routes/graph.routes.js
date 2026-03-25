import { Router } from "express";
import { getGraphData } from "../controllers/graph.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", auth, getGraphData);

export default router;
