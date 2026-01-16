import { pool } from "../db/pool.js";

export async function listHalls() {
  const result = await pool.query(
    "SELECT id, name, total_seats, layout_json FROM halls ORDER BY name"
  );
  return result.rows;
}

export async function getHall(id: string) {
  const result = await pool.query(
    "SELECT id, name, total_seats, layout_json FROM halls WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
}

export async function createHall(input: { name: string; total_seats: number; layout_json: Record<string, unknown> }) {
  const result = await pool.query(
    `INSERT INTO halls (name, total_seats, layout_json)
     VALUES ($1, $2, $3)
     RETURNING id, name, total_seats, layout_json`,
    [input.name, input.total_seats, input.layout_json]
  );
  return result.rows[0];
}

export async function listSeatsByHall(hallId: string) {
  const result = await pool.query(
    "SELECT id, row_label, seat_number, seat_type, is_active FROM seats WHERE hall_id = $1 ORDER BY row_label, seat_number",
    [hallId]
  );
  return result.rows;
}

export async function createSeat(hallId: string, input: { row_label: string; seat_number: number; seat_type?: string }) {
  const result = await pool.query(
    `INSERT INTO seats (hall_id, row_label, seat_number, seat_type)
     VALUES ($1, $2, $3, COALESCE($4, 'STANDARD'))
     RETURNING id, row_label, seat_number, seat_type, is_active`,
    [hallId, input.row_label, input.seat_number, input.seat_type || null]
  );
  return result.rows[0];
}

export async function createSeatsBulk(
  hallId: string,
  input: { rows: string[]; seatsPerRow: number; seat_type?: string }
) {
  const rowLabels: string[] = [];
  const seatNumbers: number[] = [];
  const seatTypes: string[] = [];

  for (const row of input.rows) {
    for (let seatNumber = 1; seatNumber <= input.seatsPerRow; seatNumber += 1) {
      rowLabels.push(row);
      seatNumbers.push(seatNumber);
      seatTypes.push(input.seat_type || "STANDARD");
    }
  }

  const result = await pool.query(
    `INSERT INTO seats (hall_id, row_label, seat_number, seat_type)
     SELECT $1, row_label, seat_number, seat_type
     FROM UNNEST($2::text[], $3::int[], $4::text[]) AS t(row_label, seat_number, seat_type)
     ON CONFLICT (hall_id, row_label, seat_number) DO NOTHING
     RETURNING id, row_label, seat_number, seat_type, is_active`,
    [hallId, rowLabels, seatNumbers, seatTypes]
  );

  return result.rows;
}

export async function deleteHall(id: string) {
  await pool.query("DELETE FROM halls WHERE id = $1", [id]);
}
