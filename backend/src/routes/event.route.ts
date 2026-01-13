import { Request, Response, Router } from "express";
const router = Router();

import { createEvent, getEvents,addUserToEvent } from "../controller/event.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

router.get("/", (req: Request, res: Response) => {
    res.send("Successfully landed to event route");
})
router.post("/create", authMiddleware, createEvent);
router.get("/getEvents", authMiddleware, getEvents);
router.get("/addUserToEvent/:eventId", authMiddleware, addUserToEvent);

export default router;