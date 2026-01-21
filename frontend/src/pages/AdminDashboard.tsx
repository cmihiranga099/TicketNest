import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

type Movie = {
  id: string;
  title: string;
  genre: string;
  duration_min: number;
  rating: string;
  synopsis: string;
  poster_url?: string;
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
  base_price_cents: number;
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
  const [loading, setLoading] = useState(true);

  const [selectedMovieId, setSelectedMovieId] = useState<string>("");
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
  const totalRevenue = report.reduce((sum, row) => sum + Number(row.revenue_cents || 0), 0);
  const totalBookings = report.reduce((sum, row) => sum + Number(row.bookings || 0), 0);
  const stats = [
    { label: "Movies", value: movies.length },
    { label: "Halls", value: halls.length },
    { label: "Showtimes", value: showtimes.length },
    { label: "Bookings", value: totalBookings }
  ];

  async function loadData() {
    setLoading(true);
    try {
      const [moviesData, hallsData, showtimesData, reportData] = await Promise.all([
        api.request<{ movies: Movie[] }>("/movies"),
        api.request<{ halls: Hall[] }>("/halls"),
        api.request<{ showtimes: Showtime[] }>("/showtimes"),
        api.request<{ report: SalesRow[] }>("/admin/reports/sales")
      ]);
      setMovies(moviesData.movies);
      setHalls(hallsData.halls);
      setShowtimes(showtimesData.showtimes);
      setReport(reportData.report);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectMovie = (movieId: string) => {
    setSelectedMovieId(movieId);
    const movie = movies.find((item) => item.id === movieId);
    if (!movie) {
      setMovieForm({
        title: "",
        genre: "",
        duration_min: 120,
        rating: "PG",
        synopsis: "",
        poster_url: ""
      });
      return;
    }
    setMovieForm({
      title: movie.title,
      genre: movie.genre,
      duration_min: movie.duration_min,
      rating: movie.rating,
      synopsis: movie.synopsis,
      poster_url: movie.poster_url || ""
    });
  };

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
      await loadData();
      setMessage("Movie created.");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleUpdateMovie = async () => {
    if (!selectedMovieId) {
      setError("Select a movie to update.");
      return;
    }
    setError(null);
    setMessage(null);
    try {
      await api.request(`/movies/${selectedMovieId}`, {
        method: "PUT",
        body: JSON.stringify({
          ...movieForm,
          duration_min: Number(movieForm.duration_min)
        })
      });
      await loadData();
      setMessage("Movie updated.");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDeleteMovie = async (movieId: string) => {
    setError(null);
    setMessage(null);
    try {
      await api.request(`/movies/${movieId}`, { method: "DELETE" });
      await loadData();
      setMessage("Movie deleted.");
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

      await loadData();
      setMessage("Hall and seats created.");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDeleteHall = async (hallId: string) => {
    setError(null);
    setMessage(null);
    try {
      await api.request(`/halls/${hallId}`, { method: "DELETE" });
      await loadData();
      setMessage("Hall deleted.");
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
      await loadData();
      setMessage("Showtime created.");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDeleteShowtime = async (showtimeId: string) => {
    setError(null);
    setMessage(null);
    try {
      await api.request(`/showtimes/${showtimeId}`, { method: "DELETE" });
      await loadData();
      setMessage("Showtime deleted.");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <section className="mx-auto max-w-6xl space-y-8">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-accent/20 via-transparent to-accent-2/20 p-8 shadow-soft">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted">Admin Control</p>
            <h2 className="mt-3 text-3xl font-semibold text-ink md:text-4xl">KCC Multiplex Control Room</h2>
            <p className="mt-2 text-muted">Manage movies, halls, seats, and showtimes. Review daily sales activity.</p>
          </div>
          <div className="flex flex-col items-start gap-2 text-sm text-muted">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Live inventory</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Secure access</span>
          </div>
        </div>
        {message ? <p className="mt-4 text-sm text-ink">{message}</p> : null}
        {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/5 bg-card p-5 shadow-soft">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">{stat.label}</p>
            <p className="mt-3 text-2xl font-semibold text-ink">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/5 bg-card p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-ink">Add or edit movie</h3>
          <div className="mt-4 space-y-3">
            <select className="input w-full" value={selectedMovieId} onChange={(e) => handleSelectMovie(e.target.value)}>
              <option value="">New movie</option>
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>{movie.title}</option>
              ))}
            </select>
            <input className="input w-full" placeholder="Title" value={movieForm.title} onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })} />
            <input className="input w-full" placeholder="Genre" value={movieForm.genre} onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })} />
            <input className="input w-full" placeholder="Duration (min)" type="number" value={movieForm.duration_min} onChange={(e) => setMovieForm({ ...movieForm, duration_min: Number(e.target.value) })} />
            <input className="input w-full" placeholder="Rating" value={movieForm.rating} onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })} />
            <input className="input w-full" placeholder="Poster URL" value={movieForm.poster_url} onChange={(e) => setMovieForm({ ...movieForm, poster_url: e.target.value })} />
            <textarea className="input w-full" placeholder="Synopsis" value={movieForm.synopsis} onChange={(e) => setMovieForm({ ...movieForm, synopsis: e.target.value })} />
            <div className="flex flex-wrap gap-3">
              <button className="button" onClick={handleCreateMovie}>Create movie</button>
              <button className="button secondary" onClick={handleUpdateMovie}>Update movie</button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-card p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-ink">Add hall</h3>
          <div className="mt-4 space-y-3">
            <input className="input w-full" placeholder="Hall name" value={hallForm.name} onChange={(e) => setHallForm({ ...hallForm, name: e.target.value })} />
            <input className="input w-full" placeholder="Rows (comma separated)" value={hallForm.rows} onChange={(e) => setHallForm({ ...hallForm, rows: e.target.value })} />
            <input className="input w-full" placeholder="Seats per row" type="number" value={hallForm.seatsPerRow} onChange={(e) => setHallForm({ ...hallForm, seatsPerRow: Number(e.target.value) })} />
            <button className="button secondary w-full" onClick={handleCreateHall}>Create hall + seats</button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-card p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-ink">Add showtime</h3>
          <div className="mt-4 space-y-3">
            <select className="input w-full" value={showtimeForm.movie_id} onChange={(e) => setShowtimeForm({ ...showtimeForm, movie_id: e.target.value })}>
              <option value="">Select movie</option>
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>{movie.title}</option>
              ))}
            </select>
            <select className="input w-full" value={showtimeForm.hall_id} onChange={(e) => setShowtimeForm({ ...showtimeForm, hall_id: e.target.value })}>
              <option value="">Select hall</option>
              {halls.map((hall) => (
                <option key={hall.id} value={hall.id}>{hall.name}</option>
              ))}
            </select>
            <input className="input w-full" type="datetime-local" value={showtimeForm.starts_at} onChange={(e) => setShowtimeForm({ ...showtimeForm, starts_at: e.target.value })} />
            <input className="input w-full" type="number" placeholder="Base price cents" value={showtimeForm.base_price_cents} onChange={(e) => setShowtimeForm({ ...showtimeForm, base_price_cents: Number(e.target.value) })} />
            <button className="button w-full" onClick={handleCreateShowtime}>Create showtime</button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/5 bg-card p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-ink">Movies</h3>
          {loading ? <p className="mt-2 text-sm text-muted">Loading...</p> : null}
          <div className="mt-4 space-y-3">
            {movies.map((movie) => (
              <div key={movie.id} className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
                <div>
                  <strong className="text-ink">{movie.title}</strong>
                  <p className="text-sm text-muted">{movie.genre} - {movie.duration_min} min - {movie.rating}</p>
                </div>
                <button className="button ghost" onClick={() => handleDeleteMovie(movie.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-card p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-ink">Halls</h3>
          <div className="mt-4 space-y-3">
            {halls.map((hall) => (
              <div key={hall.id} className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
                <strong className="text-ink">{hall.name}</strong>
                <button className="button ghost" onClick={() => handleDeleteHall(hall.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-card p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-ink">Showtimes</h3>
          <div className="mt-4 space-y-3">
            {showtimes.map((showtime) => (
              <div key={showtime.id} className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
                <div>
                  <strong className="text-ink">{showtime.movie_title}</strong>
                  <p className="text-sm text-muted">{showtime.hall_name} - {new Date(showtime.starts_at).toLocaleString()}</p>
                </div>
                <button className="button ghost" onClick={() => handleDeleteShowtime(showtime.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-card p-6 shadow-soft">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-ink">Sales overview</h3>
            <p className="text-sm text-muted">Last 30 days</p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-ink">
            Total revenue: ${(totalRevenue / 100).toFixed(2)}
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {report.length === 0 ? <p className="text-sm text-muted">No data yet.</p> : null}
          {report.map((row) => (
            <div key={row.day} className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <strong className="text-ink">{new Date(row.day).toLocaleDateString()}</strong>
              <p className="text-sm text-muted">{row.bookings} bookings - ${(Number(row.revenue_cents || 0) / 100).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
