import { Router } from "express";
const router = Router();

import { createEvent } from "../controller/event.controller.js";

router.post("/create", createEvent);

export default router;