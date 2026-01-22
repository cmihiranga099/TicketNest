import Stripe from "stripe";
import { pool } from "../db/pool.js";

let cachedStripe: Stripe | null = null;
let cachedStripeKey = "";

function getStripeClient() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
  if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  if (!cachedStripe || cachedStripeKey !== stripeSecretKey) {
    cachedStripe = new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" });
    cachedStripeKey = stripeSecretKey;
  }
  return cachedStripe;
}

export async function createStripeCheckout(input: {
  booking_id: string;
  amount_cents: number;
  currency?: string;
  description: string;
  customer_email?: string;
}) {
  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: input.customer_email,
    line_items: [
      {
        price_data: {
          currency: input.currency || "usd",
          unit_amount: input.amount_cents,
          product_data: {
            name: "TicketNest Booking",
            description: input.description
          }
        },
        quantity: 1
      }
    ],
    metadata: {
      booking_id: input.booking_id
    },
    success_url: `${process.env.APP_BASE_URL}/confirmation`,
    cancel_url: `${process.env.APP_BASE_URL}/checkout`
  });

  const result = await pool.query(
    `INSERT INTO payments (booking_id, provider, amount_cents, provider_ref, status)
     VALUES ($1, $2, $3, $4, 'PENDING')
     RETURNING id, booking_id, provider, amount_cents, currency, status, provider_ref`,
    [input.booking_id, "stripe", input.amount_cents, session.id]
  );

  return {
    payment: result.rows[0],
    payment_url: session.url
  };
}

export async function markPaymentPaid(providerRef: string) {
  const result = await pool.query(
    `UPDATE payments
     SET status = 'PAID', updated_at = NOW()
     WHERE provider_ref = $1
     RETURNING id, booking_id, provider, amount_cents, status`,
    [providerRef]
  );
  return result.rows[0] || null;
}
