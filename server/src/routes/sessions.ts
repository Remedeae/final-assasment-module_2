import express from "express";
import { prisma } from "../db";
import { startSessionSchema, stopSessionSchema } from "../zodSchemas";
import { z } from "zod";

const router = express.Router();

router.post("/start", async (req, res) => {
  try {
    const data = startSessionSchema.parse(req.body);
    const startedAt = data.startedAt ? new Date(data.startedAt) : new Date();
    const created = await prisma.session.create({
      data: { userId: data.userId, gameId: data.gameId, startedAt },
    });
    res.status(201).json(created);
  } catch (e) {
    if (e instanceof z.ZodError)
      return res.status(400).json({ error: e.issues });
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/stop/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = stopSessionSchema.parse(req.body);
    const session = await prisma.session.findUnique({ where: { id } });
    if (!session) return res.status(404).json({ error: "Not found" });
    const endedAt = data.endedAt ? new Date(data.endedAt) : new Date();
    const ms = endedAt.getTime() - new Date(session.startedAt).getTime();
    const simulatedMinutes = Math.max(1, Math.round(ms / 1000)); // 1 sec = 1 minute
    const minutes =
      data.simulate === false ? Math.round(ms / 60000) : simulatedMinutes;

    const updated = await prisma.session.update({
      where: { id },
      data: { endedAt, minutes },
    });
    res.json(updated);
  } catch (e) {
    if (e instanceof z.ZodError)
      return res.status(400).json({ error: e.issues });
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
