import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { paymentCreateSchema } from "../validation/schemas.js";
import { createPayment, markPaymentPaid } from "../services/payments.js";
import { getBookingById, confirmBooking } from "../services/bookings.js";

export const paymentsRouter = Router();

paymentsRouter.post("/create", requireAuth, async (req, res) => {
  const parsed = paymentCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const booking = await getBookingById(parsed.data.booking_id);
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  if (booking.user_id !== req.user!.id) {
    return res.status(403).json({ error: "Not allowed" });
  }

  const response = await createPayment({
    booking_id: booking.id,
    provider: parsed.data.provider,
    amount_cents: booking.total_amount_cents
  });

  res.json(response);
});

paymentsRouter.post("/webhook", async (req, res) => {
  const secret = req.headers["x-webhook-secret"];
  if (!secret || secret !== process.env.PAYMENT_WEBHOOK_SECRET) {
    return res.status(401).json({ error: "Invalid webhook secret" });
  }

  const { provider_ref } = req.body;
  const payment = await markPaymentPaid(provider_ref);
  if (!payment) {
    return res.status(404).json({ error: "Payment not found" });
  }

  const booking = await confirmBooking(payment.booking_id);
  res.json({ payment, booking });
});
