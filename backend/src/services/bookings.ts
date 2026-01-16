import { pool } from "../db/pool.js";
import { v4 as uuidv4 } from "uuid";

const LOCK_MINUTES = 10;

export async function initiateBooking(input: { user_id: string; showtime_id: string; seat_ids: string[] }) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query("DELETE FROM seat_locks WHERE expires_at <= NOW()");

    const existingLocks = await client.query(
      "SELECT seat_id FROM seat_locks WHERE showtime_id = $1 AND seat_id = ANY($2::uuid[]) AND expires_at > NOW()",
      [input.showtime_id, input.seat_ids]
    );
    if (existingLocks.rowCount && existingLocks.rowCount > 0) {
      throw new Error("Some seats are temporarily locked");
    }

    const existingBookings = await client.query(
      `SELECT bs.seat_id
       FROM booking_seats bs
       JOIN bookings b ON bs.booking_id = b.id
       WHERE b.showtime_id = $1 AND b.status = 'CONFIRMED' AND bs.seat_id = ANY($2::uuid[])`,
      [input.showtime_id, input.seat_ids]
    );
    if (existingBookings.rowCount && existingBookings.rowCount > 0) {
      throw new Error("Some seats are already booked");
    }

    const showtimeResult = await client.query(
      "SELECT base_price_cents FROM showtimes WHERE id = $1",
      [input.showtime_id]
    );
    if (showtimeResult.rowCount === 0) {
      throw new Error("Showtime not found");
    }
    const basePrice = showtimeResult.rows[0].base_price_cents as number;

    const expiresAt = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
    await client.query(
      `INSERT INTO seat_locks (showtime_id, seat_id, user_id, expires_at)
       SELECT $1, seat_id, $2, $3
       FROM UNNEST($4::uuid[]) AS seat_id`,
      [input.showtime_id, input.user_id, expiresAt, input.seat_ids]
    );

    const total = basePrice * input.seat_ids.length;
    const bookingResult = await client.query(
      `INSERT INTO bookings (user_id, showtime_id, total_amount_cents)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, showtime_id, status, total_amount_cents, payment_status, created_at`,
      [input.user_id, input.showtime_id, total]
    );

    await client.query(
      `INSERT INTO booking_seats (booking_id, seat_id, price_cents)
       SELECT $1, seat_id, $2
       FROM UNNEST($3::uuid[]) AS seat_id`,
      [bookingResult.rows[0].id, basePrice, input.seat_ids]
    );

    await client.query("COMMIT");
    return bookingResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function confirmBooking(bookingId: string) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const bookingCode = uuidv4().replace(/-/g, "").slice(0, 12).toUpperCase();
    const qrPayload = `TICKETNEST:${bookingId}:${bookingCode}`;

    const result = await client.query(
      `UPDATE bookings
       SET status = 'CONFIRMED', payment_status = 'PAID', booking_code = $1, qr_payload = $2
       WHERE id = $3
       RETURNING id, user_id, showtime_id, status, total_amount_cents, payment_status, booking_code, qr_payload`,
      [bookingCode, qrPayload, bookingId]
    );

    await client.query("DELETE FROM seat_locks WHERE showtime_id = $1", [result.rows[0].showtime_id]);

    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getBookingById(bookingId: string) {
  const result = await pool.query(
    `SELECT b.id, b.user_id, b.showtime_id, b.status, b.total_amount_cents, b.payment_status,
            b.booking_code, b.qr_payload, b.created_at
     FROM bookings b
     WHERE b.id = $1`,
    [bookingId]
  );
  return result.rows[0] || null;
}

export async function listBookingsByUser(userId: string) {
  const result = await pool.query(
    `SELECT b.id, b.showtime_id, b.status, b.total_amount_cents, b.payment_status, b.booking_code, b.created_at
     FROM bookings b
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC`,
    [userId]
  );
  return result.rows;
}

export async function listBookedSeatIds(showtimeId: string) {
  const result = await pool.query(
    `SELECT bs.seat_id
     FROM booking_seats bs
     JOIN bookings b ON bs.booking_id = b.id
     WHERE b.showtime_id = $1 AND b.status = 'CONFIRMED'`,
    [showtimeId]
  );
  return result.rows.map((row) => row.seat_id as string);
}
