import dotenv from "dotenv";
import { pool } from "./pool.js";
import { hashPassword } from "../utils/password.js";

dotenv.config();

async function seed() {
  const adminEmail = "admin@ticketnest.test";
  const adminPassword = "admin1234";
  const adminName = "TicketNest Admin";

  const passwordHash = await hashPassword(adminPassword);

  await pool.query(
    `INSERT INTO users (email, name, password_hash, role)
     VALUES ($1, $2, $3, 'ADMIN')
     ON CONFLICT (email) DO NOTHING`,
    [adminEmail, adminName, passwordHash]
  );

  const movieResult = await pool.query(
    `INSERT INTO movies (title, genre, duration_min, rating, synopsis, poster_url)
     VALUES
       ('Dune: Part Two', 'Sci-Fi', 166, 'PG-13', 'Paul Atreides unites with the Fremen while a war for Arrakis tests prophecy and power.', 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1000&auto=format&fit=crop'),
       ('Oppenheimer', 'Drama', 180, 'R', 'The story of J. Robert Oppenheimer and the race to build the first atomic bomb.', 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop'),
       ('Inside Out 2', 'Animation', 96, 'PG', 'Riley navigates a new school year as unexpected emotions join Headquarters.', 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1000&auto=format&fit=crop'),
       ('Godzilla x Kong: The New Empire', 'Action', 115, 'PG-13', 'Godzilla and Kong face a hidden threat that could end their world.', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&auto=format&fit=crop'),
       ('A Quiet Place: Day One', 'Horror', 99, 'PG-13', 'A woman in New York survives the day the world goes silent.', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&auto=format&fit=crop'),
       ('Spider-Man: Across the Spider-Verse', 'Animation', 140, 'PG', 'Miles Morales teams with Spider-heroes across the multiverse to stop a new threat.', 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1000&auto=format&fit=crop')
     RETURNING id`
  );

  const hallsToCreate = [
    { name: "Aurora Hall", layout: { rows: ["A", "B", "C", "D", "E"], seatsPerRow: 10 } },
    { name: "Echo Hall", layout: { rows: ["A", "B", "C", "D"], seatsPerRow: 8 } },
    { name: "Nova Hall", layout: { rows: ["A", "B", "C", "D", "E", "F"], seatsPerRow: 12 } }
  ];

  const hallIds: string[] = [];

  for (const hall of hallsToCreate) {
    const hallResult = await pool.query(
      `INSERT INTO halls (name, total_seats, layout_json)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [hall.name, hall.layout.rows.length * hall.layout.seatsPerRow, hall.layout]
    );
    const hallId = hallResult.rows[0].id as string;
    hallIds.push(hallId);

    const seatValues: Array<[string, string, number, string]> = [];
    for (const rowLabel of hall.layout.rows) {
      for (let seatNumber = 1; seatNumber <= hall.layout.seatsPerRow; seatNumber += 1) {
        seatValues.push([hallId, rowLabel, seatNumber, "STANDARD"]);
      }
    }

    const seatInsertValues = seatValues
      .map((_, index) => `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`)
      .join(", ");

    await pool.query(
      `INSERT INTO seats (hall_id, row_label, seat_number, seat_type)
       VALUES ${seatInsertValues}
       ON CONFLICT DO NOTHING`,
      seatValues.flat()
    );
  }

  const movieIds = movieResult.rows.map((row) => row.id as string);
  const now = new Date();

  await pool.query(
    `INSERT INTO showtimes (movie_id, hall_id, starts_at, base_price_cents)
     VALUES ($1, $2, $3, $4),
            ($5, $6, $7, $8),
            ($9, $10, $11, $12),
            ($13, $14, $15, $16),
            ($17, $18, $19, $20),
            ($21, $22, $23, $24),
            ($25, $26, $27, $28),
            ($29, $30, $31, $32)`,
    [
      movieIds[0],
      hallIds[0],
      new Date(now.getTime() + 2 * 60 * 60 * 1000),
      1400,
      movieIds[1],
      hallIds[1],
      new Date(now.getTime() + 5 * 60 * 60 * 1000),
      1200,
      movieIds[2],
      hallIds[2],
      new Date(now.getTime() + 24 * 60 * 60 * 1000),
      1600,
      movieIds[0],
      hallIds[2],
      new Date(now.getTime() + 30 * 60 * 60 * 1000),
      1800,
      movieIds[1],
      hallIds[0],
      new Date(now.getTime() + 36 * 60 * 60 * 1000),
      1300,
      movieIds[3],
      hallIds[2],
      new Date(now.getTime() + 8 * 60 * 60 * 1000),
      1500,
      movieIds[4],
      hallIds[0],
      new Date(now.getTime() + 12 * 60 * 60 * 1000),
      1600,
      movieIds[5],
      hallIds[1],
      new Date(now.getTime() + 20 * 60 * 60 * 1000),
      1100
    ]
  );

  console.log("Seed complete. Admin:", adminEmail, "Password:", adminPassword);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
