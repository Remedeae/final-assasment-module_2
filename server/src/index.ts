import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import cors, { CorsOptions } from "cors";

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
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  });
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
