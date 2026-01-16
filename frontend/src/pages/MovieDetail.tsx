import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";

type MovieResponse = {
  movie: {
    id: string;
    title: string;
    genre: string;
    duration_min: number;
    rating: string;
    synopsis: string;
  };
};

type ShowtimesResponse = {
  showtimes: Array<{
    id: string;
    starts_at: string;
    hall_name: string;
    movie_id: string;
  }>;
};

export function MovieDetail() {
  const params = useParams();
  const [movie, setMovie] = useState<MovieResponse["movie"] | null>(null);
  const [showtimes, setShowtimes] = useState<ShowtimesResponse["showtimes"]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!params.id) {
        return;
      }
      try {
        const movieData = await api.request<MovieResponse>(`/movies/${params.id}`);
        const showtimesData = await api.request<ShowtimesResponse>(`/showtimes?movieId=${params.id}`);
        if (mounted) {
          setMovie(movieData.movie);
          setShowtimes(showtimesData.showtimes);
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
  }, [params.id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!movie) {
    return <p>Movie not found.</p>;
  }

  return (
    <section className="container grid" style={{ gap: 24 }}>
      <div className="card">
        <h2>{movie.title}</h2>
        <p>{movie.synopsis}</p>
        <p className="badge">{movie.genre} - {movie.duration_min} min - {movie.rating}</p>
      </div>
      <div className="card">
        <h3>Upcoming showtimes</h3>
        <div className="grid" style={{ gap: 12 }}>
          {showtimes.map((showtime) => (
            <div key={showtime.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>{new Date(showtime.starts_at).toLocaleString()}</strong>
                <p>{showtime.hall_name}</p>
              </div>
              <Link className="button" to={`/booking/${showtime.id}`}>Select seats</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
