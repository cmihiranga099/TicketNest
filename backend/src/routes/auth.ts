import { Router } from "express";
import { registerSchema, loginSchema, passwordResetRequestSchema, passwordResetSchema } from "../validation/schemas.js";
import { createUser, getUserByEmail, updatePassword, createPasswordReset, consumePasswordReset, getUserById, updateProfile } from "../services/users.js";
import { signAccessToken, signRefreshToken, verifyAccessToken } from "../utils/jwt.js";
import { verifyPassword } from "../utils/password.js";
import { requireAuth } from "../middleware/auth.js";
import { v4 as uuidv4 } from "uuid";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const existing = await getUserByEmail(parsed.data.email);
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const user = await createUser(parsed.data);
  const accessToken = signAccessToken({ id: user.id, role: user.role, email: user.email });
  const refreshToken = signRefreshToken({ id: user.id, role: user.role, email: user.email });

  res.status(201).json({ user, accessToken, refreshToken });
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const user = await getUserByEmail(parsed.data.email);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const valid = await verifyPassword(parsed.data.password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const accessToken = signAccessToken({ id: user.id, role: user.role, email: user.email });
  const refreshToken = signRefreshToken({ id: user.id, role: user.role, email: user.email });

  res.json({
    user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role, status: user.status },
    accessToken,
    refreshToken
  });
});

authRouter.post("/refresh", async (req, res) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: "Missing authorization header" });
  }
  try {
    const payload = verifyAccessToken(header.replace("Bearer ", ""));
    const accessToken = signAccessToken({ id: payload.id, role: payload.role, email: payload.email });
    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ error: "Invalid refresh token" });
  }
});

authRouter.post("/forgot", async (req, res) => {
  const parsed = passwordResetRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const user = await getUserByEmail(parsed.data.email);
  if (!user) {
    return res.status(200).json({ message: "If the email exists, a reset link was sent." });
  }

  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await createPasswordReset(user.id, token, expiresAt);

  res.json({
    message: "Password reset token generated",
    token
  });
});

authRouter.post("/reset", async (req, res) => {
  const parsed = passwordResetSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const reset = await consumePasswordReset(parsed.data.token);
  if (!reset) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }

  await updatePassword(reset.user_id, parsed.data.password);
  res.json({ message: "Password updated" });
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const user = await getUserById(req.user!.id);
  res.json({ user });
});

authRouter.patch("/me", requireAuth, async (req, res) => {
  const user = await updateProfile(req.user!.id, req.body);
  res.json({ user });
});
