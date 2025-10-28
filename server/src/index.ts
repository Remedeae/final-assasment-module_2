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

//vvv not functional atm vvv
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
          //{ email: { contains: validatedQuery.data, mode: "insensitive" } },
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

app.get("/game/:id", async (req, res) => {
  const gameId = parseInt(req.params.id);
  const validatedGameId = paramIdSchema.safeParse(gameId);
  if (!validatedGameId.success) {
    return res
      .status(400)
      .send({ message: "Invalid url", error: validatedGameId.error });
  }
  try {
    const game = await prisma.game.findUnique({
      where: { id: validatedGameId.data },
    });
    if (!game) {
      res.status(404).send("Game not found");
    }
    res.status(200).send(game);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
    res.status(500).send("Error unknown");
  } finally {
    await prisma.$disconnect();
  }
});

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

app.get("/games", async (req, res) => {
  const users = await prisma.game.findMany();
  res.json(users);
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
