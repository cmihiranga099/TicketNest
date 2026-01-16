import { pool } from "../db/pool.js";

export async function listShowtimes(movieId?: string) {
  const result = await pool.query(
    `SELECT s.id, s.starts_at, s.base_price_cents, s.status,
            m.id AS movie_id, m.title AS movie_title,
            h.id AS hall_id, h.name AS hall_name
     FROM showtimes s
     JOIN movies m ON s.movie_id = m.id
     JOIN halls h ON s.hall_id = h.id
     WHERE ($1::uuid IS NULL OR s.movie_id = $1)
     ORDER BY s.starts_at ASC`,
    [movieId || null]
  );
  return result.rows;
}

export async function getShowtime(showtimeId: string) {
  const result = await pool.query(
    `SELECT s.id, s.starts_at, s.base_price_cents, s.status,
            m.id AS movie_id, m.title AS movie_title, m.genre, m.duration_min, m.rating, m.synopsis,
            h.id AS hall_id, h.name AS hall_name, h.layout_json
     FROM showtimes s
     JOIN movies m ON s.movie_id = m.id
     JOIN halls h ON s.hall_id = h.id
     WHERE s.id = $1`,
    [showtimeId]
  );
  return result.rows[0] || null;
}

export async function createShowtime(input: { movie_id: string; hall_id: string; starts_at: string; base_price_cents: number }) {
  const result = await pool.query(
    `INSERT INTO showtimes (movie_id, hall_id, starts_at, base_price_cents)
     VALUES ($1, $2, $3, $4)
     RETURNING id, movie_id, hall_id, starts_at, base_price_cents, status`,
    [input.movie_id, input.hall_id, input.starts_at, input.base_price_cents]
  );
  return result.rows[0];
}
