import express from "express";
import { PrismaClient } from "@prisma/client";
import cors, { CorsOptions } from "cors";
import {
  newUserSchema,
  paramIdSchema,
  sessionSchema,
  stringSchema,
} from "./validator";
import { useId } from "react";

const prisma = new PrismaClient();

const corsOptions: CorsOptions = {
  origin: ["http://localhost:5173"],
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

//Users functions----------------------------------

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post("/signup", async (req, res) => {
  try {
    const validatedNewUser = newUserSchema.safeParse(req.body);
    if (!validatedNewUser.success) {
      return res
        .status(400)
        .send({ message: "Invalid input", error: validatedNewUser.error });
    }
    const newUser = await prisma.user.create({
      data: validatedNewUser.data,
    });
    res.status(200).send({ message: "User successfully added", user: newUser });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
    res.status(500).send("Error unknown");
  } finally {
    await prisma.$disconnect();
  }
});

app.get("/user/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const validatedUserId = paramIdSchema.safeParse(userId);
  if (!validatedUserId.success) {
    return res.status(400).send({
      message: "Invalid user id request",
      error: validatedUserId.error,
    });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: validatedUserId.data },
    });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
    res.status(500).send("Error unknown");
  } finally {
    await prisma.$disconnect();
  }
});

app.get("/search", async (req, res) => {
  const { q } = req.query;
  try {
    const validatedQuery = stringSchema.safeParse(q);
    if (!validatedQuery.success) {
      return res.status(400).send("Invalid search term");
    }
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { firstName: { contains: validatedQuery.data, mode: "insensitive" } },
          { lastName: { contains: validatedQuery.data, mode: "insensitive" } },
          { email: { contains: validatedQuery.data, mode: "insensitive" } },
        ],
      },
    });
    if (users.length === 0) {
      return res.status(400).send("No user matches the search");
    }
    return res.status(200).send(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
    res.status(500).send("Error unknown");
  } finally {
    await prisma.$disconnect();
  }
});

//Statistics functions----------------------------------
//Get time played for each game by userId
app.get("/user/:id/allGames", async (req, res) => {
  const userId = parseInt(req.params.id);
  const validateUserId = paramIdSchema.safeParse(userId);
  if (!validateUserId.success) {
    return res
      .status(400)
      .send({ message: "Invalid url", error: validateUserId.error });
  }
  try {
    const sessionSums = await prisma.session.groupBy({
      by: ["gameId"],
      where: { userId: validateUserId.data },
      _sum: { timePlayed: true },
    });

    const gameIds = sessionSums.map((s) => s.gameId);

    const games = await prisma.game.findMany({
      where: { id: { in: gameIds } },
      select: { id: true, name: true },
    });

    const data = sessionSums.map((s) => ({
      gameName: games.find((g) => g.id === s.gameId)?.name || "Unknown",
      totalTime: s._sum.timePlayed ?? 0,
    }));
    res.status(200).send(data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
    res.status(500).send("Error unknown");
  } finally {
    await prisma.$disconnect();
  }
});
//Get percentage played for each game by userId
app.get("/user/:id/percentTime", async (req, res) => {
  const userId = parseInt(req.params.id);
  const validateUserId = paramIdSchema.safeParse(userId);
  if (!validateUserId.success) {
    return res
      .status(400)
      .send({ message: "Invalid url", error: validateUserId.error });
  }
  try {
    const total = await prisma.session.aggregate({
      where: { userId: validateUserId.data },
      _sum: { timePlayed: true },
    });
    const sessionSums = await prisma.session.groupBy({
      by: ["gameId"],
      where: { userId: validateUserId.data },
      _sum: { timePlayed: true },
    });
    const totalMinutes = total._sum.timePlayed ?? 0;
    const sessionPercentage = sessionSums.map((s) => ({
      gameId: s.gameId,
      percent:
        totalMinutes > 0 ? ((s._sum.timePlayed ?? 0) / totalMinutes) * 100 : 0,
    }));

    const gameIds = sessionSums.map((s) => s.gameId);

    const games = await prisma.game.findMany({
      where: { id: { in: gameIds } },
      select: { id: true, name: true },
    });

    const data = sessionPercentage.map((s) => ({
      gameName: games.find((g) => g.id === s.gameId)?.name || "Unknown",
      percentPlayed: s.percent,
    }));
    res.status(200).send(data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
    res.status(500).send("Error unknown");
  } finally {
    await prisma.$disconnect();
  }
});

//Get total time played by userId
app.get("/user/:id/totalTime", async (req, res) => {
  const userId = parseInt(req.params.id);
  const validateUserId = paramIdSchema.safeParse(userId);
  if (!validateUserId.success) {
    return res
      .status(400)
      .send({ message: "Invalid url", error: validateUserId.error });
  }
  try {
    const time = await prisma.session.aggregate({
      where: { userId: validateUserId.data },
      _sum: { timePlayed: true },
    });
    const data = time._sum.timePlayed ?? 0;
    res.status(200).send(data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
    res.status(500).send("Error unknown");
  } finally {
    await prisma.$disconnect();
  }
});
//Total game time across all users ------------
app.get("/allusers/timePlayed", async (req, res) => {
  try {
    const sessionSums = await prisma.session.groupBy({
      by: ["gameId"],
      _sum: { timePlayed: true },
    });
    const gameIds = sessionSums.map((s) => s.gameId);

    const games = await prisma.game.findMany({
      where: { id: { in: gameIds } },
      select: { id: true, name: true },
    });
    const data = sessionSums.map((s) => ({
      gameName: games.find((g) => g.id === s.gameId)?.name || "Unknown",
      totalTime: s._sum.timePlayed ?? 0,
    }));
    res.status(200).send(data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
    res.status(500).send("Error unknown");
  } finally {
    await prisma.$disconnect();
  }
});
//Get Leader Board---------------------------------
app.get("/allusers/timePlayed", async (req, res) => {
  try {
    const sessionSums = await prisma.session.groupBy({
      by: ["gameId"],
      _sum: { timePlayed: true },
    });
    const gameIds = sessionSums.map((s) => s.gameId);

    const games = await prisma.game.findMany({
      where: { id: { in: gameIds } },
      select: { id: true, name: true },
    });
    const data = sessionSums.map((s) => ({
      gameName: games.find((g) => g.id === s.gameId)?.name || "Unknown",
      totalTime: s._sum.timePlayed ?? 0,
    }));
    res.status(200).send(data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
    res.status(500).send("Error unknown");
  } finally {
    await prisma.$disconnect();
  }
});
//Game functions----------------------------------

app.get("/leaderBoard", async (req, res) => {
  try {
    const maxTimes = await prisma.session.groupBy({
      by: ["gameId"],
      _max: { timePlayed: true },
    });
    const topSessions = await prisma.session.findMany({
      where: {
        OR: maxTimes.map((m) => ({
          gameId: m.gameId,
          timePlayed: m._max.timePlayed!,
        })),
      },
      select: {
        gameId: true,
        timePlayed: true,
        userId: true,
      },
    });
    const topPlayerIds = topSessions.map((p) => p.userId);
    const topPlayers = await prisma.user.findMany({
      where: { id: { in: topPlayerIds } },
      select: { id: true, firstName: true },
    });
    const gameIds = topSessions.map((s) => s.gameId);
    const games = await prisma.game.findMany({
      where: { id: { in: gameIds } },
      select: { id: true, name: true },
    });
    const leaderBoard = topSessions.map((s) => ({
      name: topPlayers.find((p) => p.id === s.userId)?.firstName,
      game: games.find((p) => p.id === s.gameId)?.name,
      timePlayed: s.timePlayed,
    }));
    res.status(200).send(leaderBoard);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
    res.status(500).send("Error unknown");
  } finally {
    await prisma.$disconnect();
  }
});

app.get("/games", async (req, res) => {
  const users = await prisma.game.findMany();
  res.json(users);
});

//Sessions functions----------------------------------
//Send session to DB
app.post("/game/:id", async (req, res) => {
  const gameId = parseInt(req.params.id);
  const validatedGameId = paramIdSchema.safeParse(gameId);
  if (!validatedGameId.success) {
    res
      .status(400)
      .send({ message: "Invalid url", error: validatedGameId.error });
  }
  try {
    const validatedNewSession = sessionSchema.safeParse({
      userId: req.body.userId,
      gameId: gameId,
      timePlayed: req.body.timePlayed,
    });
    if (!validatedNewSession.success) {
      return res.status(400).send({
        message: "Invalid data input",
        error: validatedNewSession.error,
      });
    }
    const newSession = await prisma.session.create({
      data: validatedNewSession.data,
    });
    res.status(201).send({
      message: "New session successfully created!",
      session: newSession,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
    res.status(500).send("Unknown error");
  } finally {
    await prisma.$disconnect();
  }
});

app.get("/sessions", async (req, res) => {
  const users = await prisma.session.findMany();
  res.json(users);
});
//Get session data for user
app.get("/user/:userId/sessions/:gameId", async (req, res) => {
  const gameId = parseInt(req.params.gameId);
  const validatedGameId = paramIdSchema.safeParse(gameId);
  if (!validatedGameId.success) {
    res
      .status(400)
      .send({ message: "Invalid url", error: validatedGameId.error });
  }
  const userId = parseInt(req.params.userId);
  const validatedUserId = paramIdSchema.safeParse(userId);
  if (!validatedUserId.success) {
    res.status(500).send({
      message: "Invalid game ID input",
      error: validatedUserId.error,
    });
  }
  try {
    const countSession = await prisma.session.groupBy({
      by: ["gameId"],
      _count: {
        id: true,
      },
      where: {
        gameId: validatedGameId.data,
        userId: validatedUserId.data,
      },
    });
    //make this into a proper object, call avarage session length
    res.status(201).send(countSession);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
    res.status(500).send("Unknown error");
  } finally {
    await prisma.$disconnect();
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
