import { Link } from "react-router-dom";

type MovieCardProps = {
  id: string;
  title: string;
  genre: string;
  duration_min: number;
  rating: string;
  synopsis: string;
  poster_url?: string;
};

export function MovieCard({ id, title, genre, duration_min, rating, synopsis, poster_url }: MovieCardProps) {
  return (
    <article className="card movie-card">
      <div
        className="movie-poster"
        style={{
          background: poster_url
            ? `url(${poster_url}) center/cover`
            : "linear-gradient(135deg, #1a2633, #ffb347)"
        }}
      />
      <div className="movie-meta">
        <h3>{title}</h3>
        <p>{synopsis}</p>
        <div className="movie-tags">
          <span className="badge">{genre}</span>
          <span className="tag ghost">{duration_min} min</span>
          <span className="tag">{rating}</span>
        </div>
        <Link className="button small" to={`/movies/${id}`}>
          View showtimes
        </Link>
      </div>
    </article>
  );
}
