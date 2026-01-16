import express from "express";
import cors from "cors";
import helmet from "helmet";
import { authRouter } from "./routes/auth.js";
import { moviesRouter } from "./routes/movies.js";
import { hallsRouter } from "./routes/halls.js";
import { showtimesRouter } from "./routes/showtimes.js";
import { bookingsRouter } from "./routes/bookings.js";
import { paymentsRouter } from "./routes/payments.js";
import { adminRouter } from "./routes/admin.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use("/payments/webhook", express.raw({ type: "application/json" }));
  app.use((req, res, next) => {
    if (req.path === "/payments/webhook") {
      return next();
    }
    return express.json({ limit: "2mb" })(req, res, next);
  });

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/auth", authRouter);
  app.use("/movies", moviesRouter);
  app.use("/halls", hallsRouter);
  app.use("/showtimes", showtimesRouter);
  app.use("/bookings", bookingsRouter);
  app.use("/payments", paymentsRouter);
  app.use("/admin", adminRouter);

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "Unexpected server error" });
  });

  return app;
}
