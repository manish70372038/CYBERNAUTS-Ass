import express from "express";
import { getGraph } from "../controllers/graphController";

const router = express.Router();

router.get("/", getGraph);

export default router;