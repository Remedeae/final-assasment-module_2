import express from "express";
import { prisma } from "../db";
import { upload } from "../middleware/upload";
import { userCreateSchema, userUpdateSchema } from "../zodSchemas";
import { z } from "zod";

const router = express.Router();

router.get("/", async (req, res) => {
  const { q, page = "1", pageSize = "8" } = req.query as Record<string, string>;
  const skip = (Number(page) - 1) * Number(pageSize);
  const where = q
    ? {
        OR: [
          { firstName: { contains: q, mode: "insensitive" } },
          { lastName: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};
  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: Number(pageSize),
      orderBy: { id: "asc" },
    }),
    prisma.user.count({ where }),
  ]);
  res.json({ items, total });
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json(user);
});

router.post("/", upload.single("profilePic"), async (req, res) => {
  try {
    const data = userCreateSchema.parse(req.body);
    const file = req.file;
    const created = await prisma.user.create({
      data: {
        ...data,
        profilePic: file ? `/uploads/${file.filename}` : null,
      },
    });
    res.status(201).json(created);
  } catch (e) {
    if (e instanceof z.ZodError)
      return res.status(400).json({ error: e.issues });
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = userUpdateSchema.parse(req.body);
    const updated = await prisma.user.update({ where: { id }, data });
    res.json(updated);
  } catch (e: unknown) {
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code?: string }).code === "P2025"
    )
      return res.status(404).json({ error: "Not found" });
    res.status(400).json({ error: "Bad request" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.user.delete({ where: { id } });
    res.status(204).end();
  } catch (e: unknown) {
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code?: string }).code === "P2025"
    )
      return res.status(404).json({ error: "Not found" });
    res.status(400).json({ error: "Bad request" });
  }
});

export default router;
