import express from "express";
import { PrismaClient } from "@prisma/client";
import cors, { CorsOptions } from "cors";
import { paramIdSchema, sessionSchema } from "./validator";

const prisma = new PrismaClient();

const corsOptions: CorsOptions = {
  origin: ["http://localhost:5173"],
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get("/user/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const validatedUserId = paramIdSchema.safeParse(userId);
  if (!validatedUserId.success) {
    res.status(400).send({
      message: "Invalid user id request",
      error: validatedUserId.error,
    });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: validatedUserId.data },
    });
    if (user) {
      res.status(404).send("User not found");
    }
    res.json(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/games/:id", async (req, res) => {
  const gameId = parseInt(req.params.id);
  const validatedGameId = paramIdSchema.safeParse(gameId);
  if (!validatedGameId.success) {
    res
      .status(400)
      .send({ message: "Invalid game ID", error: validatedGameId.error });
  }
  try {
    const validatedNewSession = sessionSchema.safeParse({
      userId: req.body.userId,
      gameId: gameId,
      minutes: req.body.minutes || 0,
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
      message: "New session successfully startd",
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

app.get("/games", async (req, res) => {
  const users = await prisma.game.findMany();
  res.json(users);
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
