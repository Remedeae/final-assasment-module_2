import express from "express";
import { prisma } from "../db";
import { z } from "zod";

const router = express.Router();

// GET /api/games
router.get("/", async (_req, res) => {
  const games = await prisma.game.findMany({ orderBy: { id: "asc" } });
  res.json(games);
});

// POST /api/games  { name: string }
router.post("/", async (req, res) => {
  const schema = z.object({ name: z.string().min(1) });
  const parse = schema.safeParse(req.body);
  if (!parse.success)
    return res.status(400).json({ error: parse.error.issues });

  try {
    const game = await prisma.game.create({ data: { name: parse.data.name } });
    res.status(201).json(game);
  } catch (err: unknown) {
    // unique constraint -> conflict
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code?: string }).code === "P2002"
    )
      return res.status(409).json({ error: "Game name already exists" });
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
