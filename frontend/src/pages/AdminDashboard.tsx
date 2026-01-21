import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, clearToken } from "../api/client";

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
  const navigate = useNavigate();
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

  const handleLogout = () => {
    clearToken();
    navigate("/signin");
  };
  return (
    <section className="admin-shell">
      <div className="admin-layout">
        <aside className="admin-sidebar fade-up">
          <div className="admin-profile">
            <div className="admin-avatar" aria-hidden="true">A</div>
            <div>
              <p className="admin-profile-name">Admin Profile</p>
              <span className="admin-profile-meta">admin@ticketnest.com</span>
            </div>
          </div>
          <nav className="admin-nav">
            <a className="admin-nav-link" href="#admin-dashboard">Dashboard</a>
            <a className="admin-nav-link" href="#admin-movies">Movies</a>
            <a className="admin-nav-link" href="#admin-halls">Halls</a>
            <a className="admin-nav-link" href="#admin-showtimes">Showtimes</a>
            <a className="admin-nav-link" href="#admin-sales">Sales</a>
            <a className="admin-nav-link" href="#admin-users">Users</a>
            <a className="admin-nav-link" href="#admin-settings">Settings</a>
            <button className="admin-nav-link danger" type="button" onClick={handleLogout}>Log out</button>
          </nav>
        </aside>

        <div className="admin-main">
          <div className="admin-hero fade-up" id="admin-dashboard">
            <div className="admin-hero-main">
              <div>
                <p className="admin-eyebrow">Admin control</p>
                <h2 className="admin-title">TicketNest Command Deck</h2>
                <p className="admin-lede">Tune the roster, halls, and showtimes while tracking daily revenue flow.</p>
              </div>
              <div className="admin-hero-actions">
                <div className="admin-tag-row">
                  <span className="admin-tag">Live inventory</span>
                  <span className="admin-tag">Seat automation</span>
                  <span className="admin-tag">Secure access</span>
                </div>
                <button className="button ghost small" onClick={handleLogout}>Log out</button>
              </div>
            </div>
            <div className="admin-hero-panel">
              <div className="admin-hero-kpis">
                <div>
                  <span>Revenue</span>
                  <strong>${(totalRevenue / 100).toFixed(2)}</strong>
                </div>
                <div>
                  <span>Bookings</span>
                  <strong>{totalBookings}</strong>
                </div>
                <div>
                  <span>Active halls</span>
                  <strong>{halls.length}</strong>
                </div>
                <div>
                  <span>Showtimes</span>
                  <strong>{showtimes.length}</strong>
                </div>
              </div>
              <div className="admin-hero-foot">
                <span>Last 30 days</span>
                <span>{loading ? "Syncing data..." : "All systems nominal"}</span>
              </div>
            </div>
            {message ? <p className="admin-alert success">{message}</p> : null}
            {error ? <p className="admin-alert error">{error}</p> : null}
          </div>

          <div className="admin-stats">
            {stats.map((stat, index) => (
              <div key={stat.label} className={`admin-kpi fade-up delay-${index + 1}`}>
                <p>{stat.label}</p>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>

          <div className="admin-grid">
            <div className="admin-forms">
              <section className="admin-panel fade-up delay-1" id="admin-movies">
            <div className="admin-panel-head">
              <div>
                <h3>Movie studio</h3>
                <p className="admin-panel-sub">Launch, update, or swap the current lineup.</p>
              </div>
              <span className="admin-pill">Inventory</span>
            </div>
            <div className="admin-form">
              <label className="admin-field">
                <span className="label">Select film</span>
                <select className="input w-full" value={selectedMovieId} onChange={(e) => handleSelectMovie(e.target.value)}>
                  <option value="">New movie</option>
                  {movies.map((movie) => (
                    <option key={movie.id} value={movie.id}>{movie.title}</option>
                  ))}
                </select>
              </label>
              <label className="admin-field">
                <span className="label">Title</span>
                <input className="input w-full" value={movieForm.title} onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })} />
              </label>
              <label className="admin-field">
                <span className="label">Genre</span>
                <input className="input w-full" value={movieForm.genre} onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })} />
              </label>
              <div className="admin-field-grid">
                <label className="admin-field">
                  <span className="label">Duration (min)</span>
                  <input className="input w-full" type="number" value={movieForm.duration_min} onChange={(e) => setMovieForm({ ...movieForm, duration_min: Number(e.target.value) })} />
                </label>
                <label className="admin-field">
                  <span className="label">Rating</span>
                  <input className="input w-full" value={movieForm.rating} onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })} />
                </label>
              </div>
              <label className="admin-field">
                <span className="label">Poster URL</span>
                <input className="input w-full" value={movieForm.poster_url} onChange={(e) => setMovieForm({ ...movieForm, poster_url: e.target.value })} />
              </label>
              <label className="admin-field">
                <span className="label">Synopsis</span>
                <textarea className="input w-full" value={movieForm.synopsis} onChange={(e) => setMovieForm({ ...movieForm, synopsis: e.target.value })} />
              </label>
              <div className="admin-actions">
                <button className="button" onClick={handleCreateMovie}>Create movie</button>
                <button className="button secondary" onClick={handleUpdateMovie}>Update movie</button>
              </div>
            </div>
          </section>

          <section className="admin-panel fade-up delay-2" id="admin-halls">
            <div className="admin-panel-head">
              <div>
                <h3>Hall architect</h3>
                <p className="admin-panel-sub">Define seating blocks and generate seats instantly.</p>
              </div>
              <span className="admin-pill">Layouts</span>
            </div>
            <div className="admin-form">
              <label className="admin-field">
                <span className="label">Hall name</span>
                <input className="input w-full" value={hallForm.name} onChange={(e) => setHallForm({ ...hallForm, name: e.target.value })} />
              </label>
              <label className="admin-field">
                <span className="label">Rows (comma separated)</span>
                <input className="input w-full" value={hallForm.rows} onChange={(e) => setHallForm({ ...hallForm, rows: e.target.value })} />
              </label>
              <label className="admin-field">
                <span className="label">Seats per row</span>
                <input className="input w-full" type="number" value={hallForm.seatsPerRow} onChange={(e) => setHallForm({ ...hallForm, seatsPerRow: Number(e.target.value) })} />
              </label>
              <button className="button secondary w-full" onClick={handleCreateHall}>Create hall + seats</button>
            </div>
          </section>

          <section className="admin-panel fade-up delay-3" id="admin-showtimes">
            <div className="admin-panel-head">
              <div>
                <h3>Showtime scheduler</h3>
                <p className="admin-panel-sub">Assign films to halls and set pricing.</p>
              </div>
              <span className="admin-pill">Programming</span>
            </div>
            <div className="admin-form">
              <label className="admin-field">
                <span className="label">Select movie</span>
                <select className="input w-full" value={showtimeForm.movie_id} onChange={(e) => setShowtimeForm({ ...showtimeForm, movie_id: e.target.value })}>
                  <option value="">Select movie</option>
                  {movies.map((movie) => (
                    <option key={movie.id} value={movie.id}>{movie.title}</option>
                  ))}
                </select>
              </label>
              <label className="admin-field">
                <span className="label">Select hall</span>
                <select className="input w-full" value={showtimeForm.hall_id} onChange={(e) => setShowtimeForm({ ...showtimeForm, hall_id: e.target.value })}>
                  <option value="">Select hall</option>
                  {halls.map((hall) => (
                    <option key={hall.id} value={hall.id}>{hall.name}</option>
                  ))}
                </select>
              </label>
              <div className="admin-field-grid">
                <label className="admin-field">
                  <span className="label">Starts at</span>
                  <input className="input w-full" type="datetime-local" value={showtimeForm.starts_at} onChange={(e) => setShowtimeForm({ ...showtimeForm, starts_at: e.target.value })} />
                </label>
                <label className="admin-field">
                  <span className="label">Base price (cents)</span>
                  <input className="input w-full" type="number" value={showtimeForm.base_price_cents} onChange={(e) => setShowtimeForm({ ...showtimeForm, base_price_cents: Number(e.target.value) })} />
                </label>
              </div>
              <button className="button w-full" onClick={handleCreateShowtime}>Create showtime</button>
            </div>
          </section>
        </div>

        <div className="admin-side">
          <section className="admin-panel fade-up delay-2">
            <div className="admin-panel-head">
              <div>
                <h3>Movies</h3>
                <p className="admin-panel-sub">Active catalog by title.</p>
              </div>
              <span className="admin-pill">Titles</span>
            </div>
            {loading ? <p className="admin-muted">Loading...</p> : null}
            <div className="admin-list">
              {movies.map((movie) => (
                <div key={movie.id} className="admin-list-item">
                  <div>
                    <strong>{movie.title}</strong>
                    <p>{movie.genre} - {movie.duration_min} min - {movie.rating}</p>
                  </div>
                  <button className="button ghost small" onClick={() => handleDeleteMovie(movie.id)}>Delete</button>
                </div>
              ))}
            </div>
          </section>

          <section className="admin-panel fade-up delay-3">
            <div className="admin-panel-head">
              <div>
                <h3>Halls</h3>
                <p className="admin-panel-sub">Configured venues and seating blocks.</p>
              </div>
              <span className="admin-pill">Spaces</span>
            </div>
            <div className="admin-list">
              {halls.map((hall) => (
                <div key={hall.id} className="admin-list-item">
                  <strong>{hall.name}</strong>
                  <button className="button ghost small" onClick={() => handleDeleteHall(hall.id)}>Delete</button>
                </div>
              ))}
            </div>
          </section>

          <section className="admin-panel fade-up delay-4">
            <div className="admin-panel-head">
              <div>
                <h3>Showtimes</h3>
                <p className="admin-panel-sub">Upcoming sessions across halls.</p>
              </div>
              <span className="admin-pill">Schedule</span>
            </div>
            <div className="admin-list">
              {showtimes.map((showtime) => (
                <div key={showtime.id} className="admin-list-item">
                  <div>
                    <strong>{showtime.movie_title}</strong>
                    <p>{showtime.hall_name} - {new Date(showtime.starts_at).toLocaleString()}</p>
                  </div>
                  <button className="button ghost small" onClick={() => handleDeleteShowtime(showtime.id)}>Delete</button>
                </div>
              ))}
            </div>
          </section>

          <section className="admin-panel admin-sales fade-up delay-4" id="admin-sales">
            <div className="admin-panel-head">
              <div>
                <h3>Sales overview</h3>
                <p className="admin-panel-sub">30-day performance snapshot.</p>
              </div>
              <span className="admin-pill">Analytics</span>
            </div>
            <div className="admin-sales-total">
              <span>Total revenue</span>
              <strong>${(totalRevenue / 100).toFixed(2)}</strong>
            </div>
            <div className="admin-sales-grid">
              {report.length === 0 ? <p className="admin-muted">No data yet.</p> : null}
              {report.map((row) => (
                <div key={row.day} className="admin-sales-card">
                  <strong>{new Date(row.day).toLocaleDateString()}</strong>
                  <p>{row.bookings} bookings</p>
                  <span>${(Number(row.revenue_cents || 0) / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="admin-panel fade-up delay-4" id="admin-users">
            <div className="admin-panel-head">
              <div>
                <h3>Users</h3>
                <p className="admin-panel-sub">Account controls and access rules.</p>
              </div>
              <span className="admin-pill">Roles</span>
            </div>
            <p className="admin-muted">User management tools will appear here.</p>
          </section>

          <section className="admin-panel fade-up delay-4" id="admin-settings">
            <div className="admin-panel-head">
              <div>
                <h3>Settings</h3>
                <p className="admin-panel-sub">Brand, pricing, and system preferences.</p>
              </div>
              <span className="admin-pill">Config</span>
            </div>
            <p className="admin-muted">Configure system defaults when available.</p>
          </section>
        </div>
      </div>
        </div>
      </div>
    </section>
  );
}

