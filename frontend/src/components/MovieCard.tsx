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
    <article className="card">
      <div style={{
        background: `url(${poster_url}) center/cover`,
        height: 160,
        borderRadius: 14,
        marginBottom: 16
      }} />
      <h3>{title}</h3>
      <p>{synopsis}</p>
      <p className="badge">{genre} - {duration_min} min - {rating}</p>
      <Link className="button" to={`/movies/${id}`}>
        Explore
      </Link>
    </article>
  );
}

