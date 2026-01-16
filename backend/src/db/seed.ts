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
       ('Solar Drift', 'Sci-Fi', 128, 'PG-13', 'A rogue navigator chases a drifting planet that emits strange signals.', null),
       ('Midnight Deli', 'Drama', 102, 'PG', 'A chef opens a night-only diner that mends a fractured city.', null),
       ('Copper Crown', 'Adventure', 140, 'PG-13', 'A forgotten kingdom hunts for the heir who never returned.', null)
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
            ($17, $18, $19, $20)`,
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
      1300
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
