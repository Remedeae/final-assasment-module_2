import express from "express";
import { prisma } from "../db";

const router = express.Router();

router.get("/user/:id", async (req, res) => {
  const id = Number(req.params.id);
  const sessions = await prisma.session.findMany({
    where: { userId: id, minutes: { not: null } },
  });
  const byGame = new Map<number, number>();
  let total = 0;
  sessions.forEach((s) => {
    const m = s.minutes ?? 0;
    total += m;
    byGame.set(s.gameId, (byGame.get(s.gameId) ?? 0) + m);
  });
  res.json({
    total,
    byGame: Array.from(byGame.entries()).map(([gameId, minutes]) => ({
      gameId,
      minutes,
    })),
  });
});

router.get("/weekly", async (_req, res) => {
  const now = new Date();
  const from = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
  const sessions = await prisma.session.findMany({
    where: { startedAt: { gte: from }, minutes: { not: null } },
    include: { user: true, game: true },
    orderBy: { startedAt: "asc" },
  });

  // per day per user totals
  const perDayUser: Record<string, Record<number, number>> = {};
  // dot chart: per game list of points (user, total minutes over 7 days)
  const perGameUser: Record<string, Record<number, number>> = {};

  // leader over last 4 weeks
  const fourWeeksAgo = new Date(now.getTime() - 27 * 24 * 60 * 60 * 1000);
  const leaderSessions = await prisma.session.findMany({
    where: { startedAt: { gte: fourWeeksAgo }, minutes: { not: null } },
    include: { user: true, game: true },
  });
  const leaderboard: Record<number, number> = {};
  leaderSessions.forEach((s) => {
    const uid = s.userId;
    leaderboard[uid] = (leaderboard[uid] ?? 0) + (s.minutes ?? 0);
  });

  sessions.forEach((s) => {
    const day = s.startedAt.toISOString().slice(0, 10);
    perDayUser[day] = perDayUser[day] || {};
    perDayUser[day][s.userId] =
      (perDayUser[day][s.userId] ?? 0) + (s.minutes ?? 0);

    const g = s.game.name;
    perGameUser[g] = perGameUser[g] || {};
    perGameUser[g][s.userId] =
      (perGameUser[g][s.userId] ?? 0) + (s.minutes ?? 0);
  });

  res.json({ perDayUser, perGameUser, leaderboard });
});

export default router;
