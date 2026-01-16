import { pool } from "../db/pool.js";

export async function listMovies() {
  const result = await pool.query(
    "SELECT id, title, genre, duration_min, rating, synopsis, poster_url, status FROM movies ORDER BY created_at DESC"
  );
  return result.rows;
}

export async function getMovie(id: string) {
  const result = await pool.query(
    "SELECT id, title, genre, duration_min, rating, synopsis, poster_url, status FROM movies WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
}

export async function createMovie(input: {
  title: string;
  genre: string;
  duration_min: number;
  rating: string;
  synopsis: string;
  poster_url?: string;
  status?: string;
}) {
  const result = await pool.query(
    `INSERT INTO movies (title, genre, duration_min, rating, synopsis, poster_url, status)
     VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 'ACTIVE'))
     RETURNING id, title, genre, duration_min, rating, synopsis, poster_url, status`,
    [input.title, input.genre, input.duration_min, input.rating, input.synopsis, input.poster_url || null, input.status]
  );
  return result.rows[0];
}

export async function updateMovie(id: string, input: Partial<{
  title: string;
  genre: string;
  duration_min: number;
  rating: string;
  synopsis: string;
  poster_url: string;
  status: string;
}>) {
  const result = await pool.query(
    `UPDATE movies
     SET title = COALESCE($1, title),
         genre = COALESCE($2, genre),
         duration_min = COALESCE($3, duration_min),
         rating = COALESCE($4, rating),
         synopsis = COALESCE($5, synopsis),
         poster_url = COALESCE($6, poster_url),
         status = COALESCE($7, status),
         updated_at = NOW()
     WHERE id = $8
     RETURNING id, title, genre, duration_min, rating, synopsis, poster_url, status`,
    [input.title || null, input.genre || null, input.duration_min || null, input.rating || null, input.synopsis || null, input.poster_url || null, input.status || null, id]
  );
  return result.rows[0] || null;
}

export async function deleteMovie(id: string) {
  await pool.query("DELETE FROM movies WHERE id = $1", [id]);
}
