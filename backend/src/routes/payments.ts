import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import Stripe from "stripe";
import { paymentCreateSchema } from "../validation/schemas.js";
import { createStripeCheckout, markPaymentPaid } from "../services/payments.js";
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

  const response = await createStripeCheckout({
    booking_id: booking.id,
    amount_cents: booking.total_amount_cents,
    description: `Booking ${booking.id}`,
    customer_email: req.user!.email
  });

  res.json(response);
});

paymentsRouter.post("/webhook", async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

  if (!signature || !webhookSecret || !stripeSecretKey) {
    return res.status(400).json({ error: "Stripe webhook not configured" });
  }

  const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" });
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature as string, webhookSecret);
  } catch (error) {
    return res.status(400).json({ error: "Invalid Stripe signature" });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const payment = await markPaymentPaid(session.id);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    const booking = await confirmBooking(payment.booking_id);
    return res.json({ payment, booking });
  }

  return res.json({ received: true });
});
