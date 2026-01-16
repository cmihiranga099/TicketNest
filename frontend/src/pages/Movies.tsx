import { useEffect, useState } from "react";
import { api } from "../api/client";
import { MovieCard } from "../components/MovieCard";

type MoviesResponse = {
  movies: Array<{
    id: string;
    title: string;
    genre: string;
    duration_min: number;
    rating: string;
    synopsis: string;
    poster_url?: string;
  }>;
};

export function Movies() {
  const [movies, setMovies] = useState<MoviesResponse["movies"]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await api.request<MoviesResponse>("/movies");
        if (mounted) {
          setMovies(data.movies);
        }
      } catch (err) {
        if (mounted) {
          setError((err as Error).message);
        }
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="container">
      <h2>Now showing</h2>
      <p>Curated picks with fresh showtimes.</p>
      <div className="grid movies">
        {movies.map((movie) => (
          <MovieCard key={movie.id} {...movie} />
        ))}
      </div>
    </section>
  );
}
