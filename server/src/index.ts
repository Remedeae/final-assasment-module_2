import express from "express";
import cors from "cors";
import { CLIENT_ORIGIN, PORT, UPLOAD_DIR } from "./config";
import usersRouter from "./routes/users";
import gamesRouter from "./routes/games";
import sessionsRouter from "./routes/sessions";
import statsRouter from "./routes/stats";

const app = express();

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(UPLOAD_DIR));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/users", usersRouter);
app.use("/api/games", gamesRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/stats", statsRouter);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
