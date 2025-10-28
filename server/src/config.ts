import path from "path";

export const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

// Use __dirname for CJS, or allow overriding via env
export const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(__dirname, "..", "uploads");

export const CLIENT_ORIGIN =
  process.env.CLIENT_ORIGIN || "http://localhost:5173";

// 1 real second == 1 simulated minute
export const SIMULATION_RATE = 60;
