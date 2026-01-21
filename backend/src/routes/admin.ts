import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { pool } from "../db/pool.js";
import { listUsersAdmin, updateUserAdmin } from "../services/users.js";
import { listBookingsAdmin, updateBookingAdmin } from "../services/bookings.js";
import { adminUserUpdateSchema, adminBookingUpdateSchema } from "../validation/schemas.js";

export const adminRouter = Router();

adminRouter.get("/reports/sales", requireAuth, requireAdmin, async (_req, res) => {
  const result = await pool.query(
    `SELECT DATE_TRUNC('day', created_at) AS day,
            COUNT(*) AS bookings,
            SUM(total_amount_cents) AS revenue_cents
     FROM bookings
     WHERE status = 'CONFIRMED'
     GROUP BY day
     ORDER BY day DESC
     LIMIT 30`
  );

  res.json({ report: result.rows });
});

adminRouter.get("/users", requireAuth, requireAdmin, async (_req, res) => {
  const users = await listUsersAdmin();
  res.json({ users });
});

adminRouter.put("/users/:id", requireAuth, requireAdmin, async (req, res) => {
  const parsed = adminUserUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const user = await updateUserAdmin(req.params.id, parsed.data);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ user });
});

adminRouter.get("/bookings", requireAuth, requireAdmin, async (_req, res) => {
  const bookings = await listBookingsAdmin();
  res.json({ bookings });
});

adminRouter.put("/bookings/:id", requireAuth, requireAdmin, async (req, res) => {
  const parsed = adminBookingUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const booking = await updateBookingAdmin(req.params.id, parsed.data);
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  res.json({ booking });
});
