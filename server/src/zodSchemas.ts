
import { z } from 'zod';

export const userCreateSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  // profilePic handled by multipart upload
});

export const userUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
});

export const startSessionSchema = z.object({
  userId: z.number().int(),
  gameId: z.number().int(),
  startedAt: z.string().datetime().optional() // client can provide, else server uses now
});

export const stopSessionSchema = z.object({
  endedAt: z.string().datetime().optional(),
  simulate: z.boolean().optional()
});
