import { pool } from "../db/pool.js";

const LOCK_MINUTES = 10;

export async function listActiveLocks(showtimeId: string, userId?: string) {
  await pool.query("DELETE FROM seat_locks WHERE expires_at <= NOW()");
  const result = await pool.query(
    `SELECT seat_id, user_id
     FROM seat_locks
     WHERE showtime_id = $1 AND expires_at > NOW()`,
    [showtimeId]
  );

  const locked = result.rows.map((row) => row.seat_id as string);
  const mine = userId
    ? result.rows.filter((row) => row.user_id === userId).map((row) => row.seat_id as string)
    : [];

  return { locked, mine };
}

export async function lockSeats(input: { showtime_id: string; user_id: string; seat_ids: string[] }) {
  if (input.seat_ids.length === 0) {
    return { seat_ids: [] };
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM seat_locks WHERE expires_at <= NOW()");

    const existingLocks = await client.query(
      `SELECT seat_id, user_id
       FROM seat_locks
       WHERE showtime_id = $1 AND seat_id = ANY($2::uuid[]) AND expires_at > NOW()`,
      [input.showtime_id, input.seat_ids]
    );
    const lockedByOthers = existingLocks.rows.filter((row) => row.user_id !== input.user_id);
    if (lockedByOthers.length > 0) {
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

    const expiresAt = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
    await client.query(
      `INSERT INTO seat_locks (showtime_id, seat_id, user_id, expires_at)
       SELECT $1, seat_id, $2, $3
       FROM UNNEST($4::uuid[]) AS seat_id
       ON CONFLICT (showtime_id, seat_id)
       DO UPDATE SET expires_at = EXCLUDED.expires_at
       WHERE seat_locks.user_id = EXCLUDED.user_id`,
      [input.showtime_id, input.user_id, expiresAt, input.seat_ids]
    );

    await client.query("COMMIT");
    return { seat_ids: input.seat_ids, expires_at: expiresAt.toISOString() };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function releaseLocks(input: { showtime_id: string; user_id: string; seat_ids: string[] }) {
  if (input.seat_ids.length === 0) {
    return { seat_ids: [] };
  }
  const result = await pool.query(
    `DELETE FROM seat_locks
     WHERE showtime_id = $1 AND user_id = $2 AND seat_id = ANY($3::uuid[])
     RETURNING seat_id`,
    [input.showtime_id, input.user_id, input.seat_ids]
  );
  return { seat_ids: result.rows.map((row) => row.seat_id as string) };
}
