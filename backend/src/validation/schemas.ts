import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(6).optional(),
  name: z.string().min(2),
  password: z.string().min(8)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email()
});

export const passwordResetSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8)
});

export const movieSchema = z.object({
  title: z.string().min(2),
  genre: z.string().min(2),
  duration_min: z.number().int().positive(),
  rating: z.string().min(1),
  synopsis: z.string().min(10),
  poster_url: z.string().url().optional(),
  status: z.string().optional()
});

export const hallSchema = z.object({
  name: z.string().min(2),
  total_seats: z.number().int().positive(),
  layout_json: z.record(z.any())
});

export const showtimeSchema = z.object({
  movie_id: z.string().uuid(),
  hall_id: z.string().uuid(),
  starts_at: z.string(),
  base_price_cents: z.number().int().positive()
});

export const bookingInitiateSchema = z.object({
  showtime_id: z.string().uuid(),
  seat_ids: z.array(z.string().uuid()).min(1)
});

export const paymentCreateSchema = z.object({
  booking_id: z.string().uuid(),
  provider: z.enum(["stripe", "paypal"]) 
});
