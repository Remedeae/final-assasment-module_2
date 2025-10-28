import multer from "multer";
import { UPLOAD_DIR } from "../config";
import fs from "fs";
import path from "path";

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (_req, file, cb) {
    const unique = Date.now() + "_" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname || "") || ".png";
    cb(null, unique + ext);
  },
});

export const upload = multer({ storage });
