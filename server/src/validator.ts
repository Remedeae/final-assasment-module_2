import { z } from "zod";

export const paramIdSchema = z.number();
export const stringSchema = z.string();

export const sessionSchema = z.object({
  userId: z.number(),
  gameId: z.number(),
  minutes: z.number().default(0),
  endedAt: z.iso
    .datetime()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
});
