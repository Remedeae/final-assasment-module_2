import { email, z } from "zod";

export const sessionSchema = z.object({
  userId: z.number(),
  gameId: z.number(),
  timePlayed: z.number().default(0),
});

export const newUserSchema = z.object({
  email: z.email(),
  firstName: z
    .string()
    .min(2, { message: "Name contain at least 3 caracters." })
    .max(50, { message: "Name cannot be longer then 50 characters" }),
  lastName: z
    .string()
    .min(3, { message: "Name contain at least 3 caracters." })
    .max(50, { message: "Name cannot be longer then 50 characters" })
    .optional(),
  profilePic: z.string().optional(),
});

export const userSchema = z.object({
  id : z.number().positive(),
  email: z.email(),
    firstName: z
    .string()
    .min(2, { message: "Name contain at least 3 caracters." })
    .max(50, { message: "Name cannot be longer then 50 characters" }),
  lastName: z
    .string()
    .min(3, { message: "Name contain at least 3 caracters." })
    .max(50, { message: "Name cannot be longer then 50 characters" })
    .optional(),
    profilePic: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
})
export const gameSchema = z.object({
  id: z.number().positive(),
  name: z.string(),
});

export const userAllGamesSchema = z.object({
  gameName: z.string(),
  totalTime: z.number().positive(),
})

export const userPercentTimeSchema = z.object({
  gameName: z.string(),
  percentPlayed: z.number().positive(),
});

export const leaderBoardSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name contain at least 3 caracters." })
    .max(50, { message: "Name cannot be longer then 50 characters" }),
  game: z.string(),
  timePlayed: z.number().positive(),
});

export const userSessionSchema = z.object({
  numSessions: z.number().positive(),
  avgSession: z.number().positive(),
});