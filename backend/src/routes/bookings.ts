import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { bookingInitiateSchema } from "../validation/schemas.js";
import { initiateBooking, confirmBooking, getBookingById, listBookingsByUser, listBookedSeatIds } from "../services/bookings.js";

export const bookingsRouter = Router();

bookingsRouter.get("/me", requireAuth, async (req, res) => {
  const bookings = await listBookingsByUser(req.user!.id);
  res.json({ bookings });
});

bookingsRouter.get("/showtimes/:id/seats", async (req, res) => {
  const booked = await listBookedSeatIds(req.params.id);
  res.json({ booked });
});

bookingsRouter.post("/initiate", requireAuth, async (req, res) => {
  const parsed = bookingInitiateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const booking = await initiateBooking({
      user_id: req.user!.id,
      showtime_id: parsed.data.showtime_id,
      seat_ids: parsed.data.seat_ids
    });
    res.status(201).json({ booking });
  } catch (error) {
    res.status(409).json({ error: (error as Error).message });
  }
});

bookingsRouter.get("/:id", requireAuth, async (req, res) => {
  const booking = await getBookingById(req.params.id);
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  res.json({ booking });
});

bookingsRouter.post("/:id/confirm", requireAuth, async (req, res) => {
  const booking = await confirmBooking(req.params.id);
  res.json({ booking });
});
