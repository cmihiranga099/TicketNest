import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

type Movie = {
  id: string;
  title: string;
};

type Hall = {
  id: string;
  name: string;
};

type Showtime = {
  id: string;
  movie_title: string;
  hall_name: string;
  starts_at: string;
};

type SalesRow = {
  day: string;
  bookings: string;
  revenue_cents: string;
};

export function AdminDashboard() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [report, setReport] = useState<SalesRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [movieForm, setMovieForm] = useState({
    title: "",
    genre: "",
    duration_min: 120,
    rating: "PG",
    synopsis: "",
    poster_url: ""
  });

  const [hallForm, setHallForm] = useState({
    name: "",
    rows: "A,B,C,D",
    seatsPerRow: 10
  });

  const [showtimeForm, setShowtimeForm] = useState({
    movie_id: "",
    hall_id: "",
    starts_at: "",
    base_price_cents: 1200
  });

  const rowList = useMemo(
    () => hallForm.rows.split(",").map((row) => row.trim()).filter(Boolean),
    [hallForm.rows]
  );

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [moviesData, hallsData, showtimesData, reportData] = await Promise.all([
          api.request<{ movies: Movie[] }>("/movies"),
          api.request<{ halls: Hall[] }>("/halls"),
          api.request<{ showtimes: Showtime[] }>("/showtimes"),
          api.request<{ report: SalesRow[] }>("/admin/reports/sales")
        ]);
        if (!mounted) {
          return;
        }
        setMovies(moviesData.movies);
        setHalls(hallsData.halls);
        setShowtimes(showtimesData.showtimes);
        setReport(reportData.report);
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

  const handleCreateMovie = async () => {
    setError(null);
    setMessage(null);
    try {
      await api.request("/movies", {
        method: "POST",
        body: JSON.stringify({
          ...movieForm,
          duration_min: Number(movieForm.duration_min)
        })
      });
      const moviesData = await api.request<{ movies: Movie[] }>("/movies");
      setMovies(moviesData.movies);
      setMessage("Movie created.");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleCreateHall = async () => {
    setError(null);
    setMessage(null);
    try {
      const hall = await api.request<{ hall: Hall }>("/halls", {
        method: "POST",
        body: JSON.stringify({
          name: hallForm.name,
          total_seats: rowList.length * hallForm.seatsPerRow,
          layout_json: {
            rows: rowList,
            seatsPerRow: hallForm.seatsPerRow
          }
        })
      });

      await api.request(`/halls/${hall.hall.id}/seats/bulk`, {
        method: "POST",
        body: JSON.stringify({
          rows: rowList,
          seatsPerRow: hallForm.seatsPerRow
        })
      });

      const hallsData = await api.request<{ halls: Hall[] }>("/halls");
      setHalls(hallsData.halls);
      setMessage("Hall and seats created.");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleCreateShowtime = async () => {
    setError(null);
    setMessage(null);
    try {
      await api.request("/showtimes", {
        method: "POST",
        body: JSON.stringify({
          movie_id: showtimeForm.movie_id,
          hall_id: showtimeForm.hall_id,
          starts_at: showtimeForm.starts_at,
          base_price_cents: Number(showtimeForm.base_price_cents)
        })
      });
      const showtimesData = await api.request<{ showtimes: Showtime[] }>("/showtimes");
      setShowtimes(showtimesData.showtimes);
      setMessage("Showtime created.");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <section className="container grid" style={{ gap: 24 }}>
      <div className="card">
        <h2>Admin dashboard</h2>
        <p>Manage movies, halls, seats, and showtimes. View the latest sales activity.</p>
        {message ? <p>{message}</p> : null}
        {error ? <p>{error}</p> : null}
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <div className="card">
          <h3>Add movie</h3>
          <div className="form">
            <input className="input" placeholder="Title" value={movieForm.title} onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })} />
            <input className="input" placeholder="Genre" value={movieForm.genre} onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })} />
            <input className="input" placeholder="Duration (min)" type="number" value={movieForm.duration_min} onChange={(e) => setMovieForm({ ...movieForm, duration_min: Number(e.target.value) })} />
            <input className="input" placeholder="Rating" value={movieForm.rating} onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })} />
            <input className="input" placeholder="Poster URL" value={movieForm.poster_url} onChange={(e) => setMovieForm({ ...movieForm, poster_url: e.target.value })} />
            <textarea className="input" placeholder="Synopsis" value={movieForm.synopsis} onChange={(e) => setMovieForm({ ...movieForm, synopsis: e.target.value })} />
            <button className="button" onClick={handleCreateMovie}>Create movie</button>
          </div>
        </div>

        <div className="card">
          <h3>Add hall</h3>
          <div className="form">
            <input className="input" placeholder="Hall name" value={hallForm.name} onChange={(e) => setHallForm({ ...hallForm, name: e.target.value })} />
            <input className="input" placeholder="Rows (comma separated)" value={hallForm.rows} onChange={(e) => setHallForm({ ...hallForm, rows: e.target.value })} />
            <input className="input" placeholder="Seats per row" type="number" value={hallForm.seatsPerRow} onChange={(e) => setHallForm({ ...hallForm, seatsPerRow: Number(e.target.value) })} />
            <button className="button secondary" onClick={handleCreateHall}>Create hall + seats</button>
          </div>
        </div>

        <div className="card">
          <h3>Add showtime</h3>
          <div className="form">
            <select className="input" value={showtimeForm.movie_id} onChange={(e) => setShowtimeForm({ ...showtimeForm, movie_id: e.target.value })}>
              <option value="">Select movie</option>
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>{movie.title}</option>
              ))}
            </select>
            <select className="input" value={showtimeForm.hall_id} onChange={(e) => setShowtimeForm({ ...showtimeForm, hall_id: e.target.value })}>
              <option value="">Select hall</option>
              {halls.map((hall) => (
                <option key={hall.id} value={hall.id}>{hall.name}</option>
              ))}
            </select>
            <input className="input" type="datetime-local" value={showtimeForm.starts_at} onChange={(e) => setShowtimeForm({ ...showtimeForm, starts_at: e.target.value })} />
            <input className="input" type="number" placeholder="Base price cents" value={showtimeForm.base_price_cents} onChange={(e) => setShowtimeForm({ ...showtimeForm, base_price_cents: Number(e.target.value) })} />
            <button className="button" onClick={handleCreateShowtime}>Create showtime</button>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <div className="card">
          <h3>Current showtimes</h3>
          <div className="grid" style={{ gap: 10 }}>
            {showtimes.map((showtime) => (
              <div key={showtime.id}>
                <strong>{showtime.movie_title}</strong>
                <p>{showtime.hall_name} - {new Date(showtime.starts_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3>Sales (last 30 days)</h3>
          <div className="grid" style={{ gap: 10 }}>
            {report.length === 0 ? <p>No data yet.</p> : null}
            {report.map((row) => (
              <div key={row.day}>
                <strong>{new Date(row.day).toLocaleDateString()}</strong>
                <p>{row.bookings} bookings - ${(Number(row.revenue_cents || 0) / 100).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
