import { Router } from "express";
import { listMovies, getMovie, createMovie, updateMovie, deleteMovie } from "../services/movies.js";
import { movieSchema } from "../validation/schemas.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

export const moviesRouter = Router();

moviesRouter.get("/", async (_req, res) => {
  const movies = await listMovies();
  res.json({ movies });
});

moviesRouter.get("/:id", async (req, res) => {
  const movie = await getMovie(req.params.id);
  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }
  res.json({ movie });
});

moviesRouter.post("/", requireAuth, requireAdmin, async (req, res) => {
  const parsed = movieSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const movie = await createMovie(parsed.data);
  res.status(201).json({ movie });
});

moviesRouter.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  const movie = await updateMovie(req.params.id, req.body);
  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }
  res.json({ movie });
});

moviesRouter.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  await deleteMovie(req.params.id);
  res.status(204).send();
});
