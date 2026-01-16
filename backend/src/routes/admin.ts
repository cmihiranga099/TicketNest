import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { pool } from "../db/pool.js";

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
