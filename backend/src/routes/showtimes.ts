import { Router } from "express";
import { showtimeSchema } from "../validation/schemas.js";
import { listShowtimes, getShowtime, createShowtime, deleteShowtime } from "../services/showtimes.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

export const showtimesRouter = Router();

showtimesRouter.get("/", async (req, res) => {
  const movieId = req.query.movieId as string | undefined;
  const showtimes = await listShowtimes(movieId);
  res.json({ showtimes });
});

showtimesRouter.get("/:id", async (req, res) => {
  const showtime = await getShowtime(req.params.id);
  if (!showtime) {
    return res.status(404).json({ error: "Showtime not found" });
  }
  res.json({ showtime });
});

showtimesRouter.post("/", requireAuth, requireAdmin, async (req, res) => {
  const parsed = showtimeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const showtime = await createShowtime(parsed.data);
  res.status(201).json({ showtime });
});

showtimesRouter.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  await deleteShowtime(req.params.id);
  res.status(204).send();
});
