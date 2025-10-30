import express from "express";
import { PrismaClient } from "@prisma/client";
import cors, { CorsOptions } from "cors";
import {
  newUserSchema,
  paramIdSchema,
  sessionSchema,
  stringSchema,
} from "./validator";

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
  }
});
//Game functions----------------------------------
//Get game based on ID

app.get("/game/:id", async (req, res) => {
  const gameId = parseInt(req.params.id);
  const validatedGameId = paramIdSchema.safeParse(gameId);

  if (!validatedGameId.success) {
    return res.status(400).send({
      message: "Invalid game id",
      error: validatedGameId.error,
    });
  }

  try {
    const game = await prisma.game.findUnique({
      where: { id: validatedGameId.data },
    });

    if (!game) {
      return res.status(404).send("Game not found");
    }

    res.status(200).send(game);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Unknown error");
    }
  }
});

//Leaderboard
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
      distinct: ["gameId"],
      select: {
        gameId: true,
        timePlayed: true,
        userId: true,
      },
      orderBy: { timePlayed: "desc" },
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
  }
});

app.get("/sessions", async (req, res) => {
  const users = await prisma.session.findMany();
  res.json(users);
});
//Get session data for all users
app.get("/sessions/:gameId", async (req, res) => {
  const gameId = parseInt(req.params.gameId);
  const validatedGameId = paramIdSchema.safeParse(gameId);
  if (!validatedGameId.success) {
    res.status(400).send({
      message: "GameId is of invalid data type",
      error: validatedGameId.error,
    });
  }
  try {
    const countSession = await prisma.session.groupBy({
      by: ["userId"],
      _count: {
        id: true,
      },
      _avg: {
        timePlayed: true,
      },
      where: {
        gameId: validatedGameId.data,
      },
    });
    if (countSession.length === 0) {
      return res.status(404).send("Game not found");
    }
    const sessionsData = countSession.map((s) => ({
      numSessions: s._count.id,
      avgSession: parseInt(s._avg.timePlayed?.toFixed(0)!),
    }));
    res.status(201).send(sessionsData);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
    res.status(500).send("Unknown error");
  }
});
//Weekly sessions (incomplete)--------------------------------------------
app.get("/weekly/:gameId", async (req, res) => {
  const gameId = parseInt(req.params.gameId);
  const validatedGameId = paramIdSchema.safeParse(gameId);
  if (!validatedGameId.success) {
    res.status(400).send({
      message: "GameId is of invalid data type",
      error: validatedGameId.error,
    });
  }
  try {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const countSession = await prisma.session.groupBy({
      by: ["userId"],
      _count: {
        id: true,
      },
      _avg: {
        timePlayed: true,
      },
      where: {
        gameId: validatedGameId.data,
        createdAt: {
          gte: lastWeek,
        },
      },
    });
    if (countSession.length === 0) {
      return res.status(404).send("Game not found");
    }
    const sessionsData = countSession.map((s) => ({
      numSessions: s._count.id,
      avgSession: parseInt(s._avg.timePlayed?.toFixed(0)!),
    }));
    res.status(201).send(sessionsData);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
    res.status(500).send("Unknown error");
  }
});

//--------------------------------------------

process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
