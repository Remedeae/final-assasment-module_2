import { z } from "zod";

export const paramIdSchema = z.number();
export const stringSchema = z.string();

export const sessionSchema = z.object({
  userId: z.number(),
  gameId: z.number(),
  timePlayed: z.number().default(0),
});

export const newUserSchema = z.object({
  email: z.email().lowercase(),
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
