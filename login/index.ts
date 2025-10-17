import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
