import express from "express";
import { PrismaClient } from "@prisma/client";
import cors, { CorsOptions } from "cors";
import { paramIdSchema } from "./validator";

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
    if (user === null) {
      res.status(404).send("User not found");
    }
    res.json(user);
  } catch (error) {
    res.status(500).send(error);
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
