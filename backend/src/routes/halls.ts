import { Router } from "express";
import { hallSchema, seatsBulkSchema } from "../validation/schemas.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { listHalls, getHall, createHall, listSeatsByHall, createSeat, createSeatsBulk, deleteHall } from "../services/halls.js";

export const hallsRouter = Router();

hallsRouter.get("/", async (_req, res) => {
  const halls = await listHalls();
  res.json({ halls });
});

hallsRouter.get("/:id", async (req, res) => {
  const hall = await getHall(req.params.id);
  if (!hall) {
    return res.status(404).json({ error: "Hall not found" });
  }
  res.json({ hall });
});

hallsRouter.get("/:id/seats", async (req, res) => {
  const seats = await listSeatsByHall(req.params.id);
  res.json({ seats });
});

hallsRouter.post("/", requireAuth, requireAdmin, async (req, res) => {
  const parsed = hallSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const hall = await createHall(parsed.data);
  res.status(201).json({ hall });
});

hallsRouter.post("/:id/seats", requireAuth, requireAdmin, async (req, res) => {
  const { row_label, seat_number, seat_type } = req.body;
  const seat = await createSeat(req.params.id, { row_label, seat_number, seat_type });
  res.status(201).json({ seat });
});

hallsRouter.post("/:id/seats/bulk", requireAuth, requireAdmin, async (req, res) => {
  const parsed = seatsBulkSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const seats = await createSeatsBulk(req.params.id, parsed.data);
  res.status(201).json({ seats });
});

hallsRouter.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  await deleteHall(req.params.id);
  res.status(204).send();
});
