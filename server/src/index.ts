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

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
