import { Link } from "react-router-dom";

export function Home() {
  return (
    <section className="container grid" style={{ gap: 32 }}>
      <div className="hero">
        <div className="fade-up">
          <span className="badge">Real-time seats - Instant tickets</span>
          <h1 className="hero-title">Cinema nights, curated and stress-free.</h1>
          <p>Pick a film, lock your seats, and receive a QR ticket in minutes. TicketNest keeps every hall synced and every booking secure.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link className="button" to="/movies">Browse movies</Link>
            <Link className="button secondary" to="/booking/s1">Start booking</Link>
          </div>
        </div>
        <div className="hero-panel fade-up delay-1">
          <h3>Tonight's flow</h3>
          <p>
            Choose movie {"->"} confirm showtime {"->"} select seats {"->"} pay {"->"} get ticket.
          </p>
          <div className="stats">
            <div className="stat-card">
              <strong>24 halls</strong>
              <p>Configurable seating maps</p>
            </div>
            <div className="stat-card">
              <strong>Stripe checkout</strong>
              <p>Secure card payments</p>
            </div>
            <div className="stat-card">
              <strong>Instant QR</strong>
              <p>Auto-issued ticket IDs</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

