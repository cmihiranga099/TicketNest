import { pool } from "../db/pool.js";
import { v4 as uuidv4 } from "uuid";

export async function createPayment(input: { booking_id: string; provider: "stripe" | "paypal"; amount_cents: number }) {
  const providerRef = uuidv4();
  const result = await pool.query(
    `INSERT INTO payments (booking_id, provider, amount_cents, provider_ref)
     VALUES ($1, $2, $3, $4)
     RETURNING id, booking_id, provider, amount_cents, currency, status, provider_ref`,
    [input.booking_id, input.provider, input.amount_cents, providerRef]
  );
  return {
    payment: result.rows[0],
    payment_url: `https://payments.example/${input.provider}/${providerRef}`
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
