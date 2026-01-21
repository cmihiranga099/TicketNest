import { Router } from "express";
import { showtimeSchema, seatLockSchema } from "../validation/schemas.js";
import { listShowtimes, getShowtime, createShowtime, deleteShowtime } from "../services/showtimes.js";
import { lockSeats, listActiveLocks, releaseLocks } from "../services/locks.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { emitSeatLocks, emitSeatUnlocks } from "../socket.js";

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

showtimesRouter.get("/:id/locks", requireAuth, async (req, res) => {
  const locks = await listActiveLocks(req.params.id, req.user!.id);
  res.json(locks);
});

showtimesRouter.post("/:id/locks", requireAuth, async (req, res) => {
  const parsed = seatLockSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  try {
    const locks = await lockSeats({
      showtime_id: req.params.id,
      user_id: req.user!.id,
      seat_ids: parsed.data.seat_ids
    });
    emitSeatLocks(req.params.id, locks.seat_ids);
    res.status(201).json(locks);
  } catch (error) {
    res.status(409).json({ error: (error as Error).message });
  }
});

showtimesRouter.delete("/:id/locks", requireAuth, async (req, res) => {
  const parsed = seatLockSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const released = await releaseLocks({
    showtime_id: req.params.id,
    user_id: req.user!.id,
    seat_ids: parsed.data.seat_ids
  });
  if (released.seat_ids.length > 0) {
    emitSeatUnlocks(req.params.id, released.seat_ids);
  }
  res.json(released);
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
