import { pool } from "../db/pool.js";
import { hashPassword } from "../utils/password.js";

export async function createUser(input: { email: string; phone?: string; name: string; password: string; role?: string }) {
  const passwordHash = await hashPassword(input.password);
  const result = await pool.query(
    `INSERT INTO users (email, phone, name, password_hash, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, phone, name, role, status, created_at`,
    [input.email, input.phone || null, input.name, passwordHash, input.role || "USER"]
  );
  return result.rows[0];
}

export async function getUserByEmail(email: string) {
  const result = await pool.query(
    "SELECT id, email, phone, name, password_hash, role, status FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0] || null;
}

export async function getUserById(id: string) {
  const result = await pool.query(
    "SELECT id, email, phone, name, role, status FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
}

export async function updateProfile(userId: string, input: { name?: string; phone?: string }) {
  const result = await pool.query(
    `UPDATE users
     SET name = COALESCE($1, name),
         phone = COALESCE($2, phone),
         updated_at = NOW()
     WHERE id = $3
     RETURNING id, email, phone, name, role, status`,
    [input.name || null, input.phone || null, userId]
  );
  return result.rows[0];
}

export async function updatePassword(userId: string, password: string) {
  const passwordHash = await hashPassword(password);
  await pool.query(
    "UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2",
    [passwordHash, userId]
  );
}

export async function createPasswordReset(userId: string, token: string, expiresAt: Date) {
  await pool.query(
    `INSERT INTO password_resets (user_id, token, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, token, expiresAt]
  );
}

export async function consumePasswordReset(token: string) {
  const result = await pool.query(
    `UPDATE password_resets
     SET used_at = NOW()
     WHERE token = $1 AND used_at IS NULL AND expires_at > NOW()
     RETURNING user_id`,
    [token]
  );
  return result.rows[0] || null;
}

export async function listUsersAdmin() {
  const result = await pool.query(
    `SELECT id, email, phone, name, role, status, created_at
     FROM users
     ORDER BY created_at DESC
     LIMIT 200`
  );
  return result.rows;
}

export async function updateUserAdmin(userId: string, input: { role?: string; status?: string }) {
  const result = await pool.query(
    `UPDATE users
     SET role = COALESCE($1, role),
         status = COALESCE($2, status),
         updated_at = NOW()
     WHERE id = $3
     RETURNING id, email, phone, name, role, status`,
    [input.role || null, input.status || null, userId]
  );
  return result.rows[0] || null;
}
