import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAdmin, subscribeAuthChange } from "../api/client";

const featured = [
  {
    title: "Solar Drift",
    genre: "Sci-Fi",
    runtime: "128 min",
    rating: "PG-13",
    tone: "citrus",
    poster: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Midnight Deli",
    genre: "Drama",
    runtime: "102 min",
    rating: "PG",
    tone: "midnight",
    poster: "https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Copper Crown",
    genre: "Adventure",
    runtime: "140 min",
    rating: "PG-13",
    tone: "copper",
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Neon Tide",
    genre: "Thriller",
    runtime: "118 min",
    rating: "R",
    tone: "neon",
    poster: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Skyline Run",
    genre: "Action",
    runtime: "110 min",
    rating: "PG-13",
    tone: "skyline",
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Golden Vale",
    genre: "Family",
    runtime: "96 min",
    rating: "PG",
    tone: "golden",
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80"
  }
];

const showtimes = [
  { film: "Solar Drift", hall: "Aurora Hall", time: "18:30", tag: "2D", price: "LKR 2,200", seats: "42 seats" },
  { film: "Midnight Deli", hall: "Echo Hall", time: "19:00", tag: "2D", price: "LKR 1,800", seats: "38 seats" },
  { film: "Copper Crown", hall: "Nova Hall", time: "20:15", tag: "Dolby", price: "LKR 2,600", seats: "26 seats" },
  { film: "Neon Tide", hall: "Nova Hall", time: "21:30", tag: "Dolby", price: "LKR 2,600", seats: "19 seats" },
  { film: "Skyline Run", hall: "Aurora Hall", time: "22:10", tag: "IMAX", price: "LKR 3,200", seats: "31 seats" },
  { film: "Golden Vale", hall: "Echo Hall", time: "16:15", tag: "2D", price: "LKR 1,500", seats: "54 seats" }
];

const metrics = [
  { label: "Seats locked in", value: "2,640+" },
  { label: "Avg checkout time", value: "48 sec" },
  { label: "Cities online", value: "12" }
];

const highlights = [
  {
    title: "Live seat maps",
    copy: "Every seat lock updates instantly across all devices.",
    tag: "Realtime"
  },
  {
    title: "Fast checkout",
    copy: "Smart wallet and saved cards for repeat visits.",
    tag: "Express"
  },
  {
    title: "Crew booking",
    copy: "Hold seats together and split payments cleanly.",
    tag: "Group"
  }
];

const steps = [
  {
    title: "Pick a showtime",
    copy: "Filter by cinema, time, or experience in seconds."
  },
  {
    title: "Lock your seats",
    copy: "Real-time availability keeps your group together."
  },
  {
    title: "Checkout once",
    copy: "Save your details and get instant QR tickets."
  }
];

const experiences = [
  {
    title: "IMAX Ultra",
    copy: "Massive screen, tuned audio, and laser projection.",
    tag: "Premium"
  },
  {
    title: "Dolby Atmos",
    copy: "360 audio and deep contrast for cinematic nights.",
    tag: "Immersive"
  },
  {
    title: "Luxury Recliners",
    copy: "Extra legroom, blanket service, and lounge seats.",
    tag: "Comfort"
  }
];

const offers = [
  {
    title: "Weekday Saver",
    copy: "Book before 3PM and save 20 percent on tickets."
  },
  {
    title: "Family Combo",
    copy: "4 tickets + snacks bundle for a flat offer."
  },
  {
    title: "Student Pass",
    copy: "Show your ID and enjoy weekend discounts."
  }
];

export function Home() {
  const [showAdmin, setShowAdmin] = useState(isAdmin());

  useEffect(() => {
    const update = () => setShowAdmin(isAdmin());
    const unsubscribe = subscribeAuthChange(update);
    return unsubscribe;
  }, []);

  return (
    <section className="home modern">
      <div className="container hero-rail">
        <div className="hero-content fade-up">
          <span className="badge badge-glow">Smart booking for modern cinemas</span>
          <h1 className="hero-title">Ticket booking, timed to the second.</h1>
          <p className="hero-copy">
            Instant seat locks, personalized showtimes, and an experience built for the way you plan nights out.
          </p>
          <div className="hero-actions">
            <Link className="button" to="/movies">Explore shows</Link>
            <Link className="button secondary" to="/booking/s1">Book seats</Link>
            {showAdmin ? (
              <Link className="button ghost" to="/admin">Admin control</Link>
            ) : null}
          </div>
          <div className="hero-metrics">
            {metrics.map((metric) => (
              <div className="metric-card" key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-panel fade-up delay-1">
          <div className="panel-header">
            <div>
              <h3>Quick booking</h3>
              <p className="panel-subcopy">Secure seats before they disappear.</p>
            </div>
            <span className="tag">Live</span>
          </div>
          <div className="booking-fields">
            <div>
              <label className="label">Location</label>
              <select className="input">
                <option>Colombo</option>
                <option>Galle</option>
                <option>Kandy</option>
              </select>
            </div>
            <div>
              <label className="label">Date</label>
              <input className="input" type="date" />
            </div>
            <div>
              <label className="label">Cinema</label>
              <select className="input">
                <option>TicketNest Multiplex</option>
                <option>Aurora Hall</option>
                <option>Nova Hall</option>
              </select>
            </div>
            <div>
              <label className="label">Experience</label>
              <select className="input">
                <option>2D</option>
                <option>Dolby</option>
                <option>IMAX</option>
              </select>
            </div>
          </div>
          <button className="button full-width">Find showtimes</button>
          <div className="ticket-stack">
            {showtimes.slice(0, 3).map((slot) => (
              <div className="ticket-card" key={`${slot.film}-${slot.time}`}>
                <div>
                  <h4>{slot.film}</h4>
                  <p>{slot.hall} • {slot.tag}</p>
                </div>
                <div className="ticket-meta">
                  <span>{slot.time}</span>
                  <span>{slot.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container section">
        <div className="section-head">
          <h2>Trending tonight</h2>
          <Link className="button ghost" to="/movies">Full lineup</Link>
        </div>
        <div className="film-grid modern-grid">
          {featured.map((film) => (
            <div className="film-card" key={film.title}>
              <div
                className={`film-poster ${film.tone}`}
                style={{ backgroundImage: `linear-gradient(180deg, rgba(10, 12, 16, 0.1), rgba(10, 12, 16, 0.75)), url(${film.poster})` }}
              />
              <div className="film-meta">
                <div className="film-top">
                  <h3>{film.title}</h3>
                  <span className="tag ghost">{film.rating}</span>
                </div>
                <p>{film.genre} • {film.runtime}</p>
                <div className="film-actions">
                  <span className="tag">Prime</span>
                  <Link className="button small" to="/movies">Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container section split">
        <div className="card glass-board">
          <div className="section-head">
            <h2>Why TicketNest</h2>
            <span className="tag">Always live</span>
          </div>
          <div className="perk-grid">
            {highlights.map((item) => (
              <div className="perk-card" key={item.title}>
                <div className="perk-header">
                  <h3>{item.title}</h3>
                  <span className="tag ghost">{item.tag}</span>
                </div>
                <p>{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card steps-board">
          <h2>Book in three steps</h2>
          <div className="step-grid">
            {steps.map((step, index) => (
              <div className="step-card" key={step.title}>
                <span className="step-number">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container section">
        <div className="section-head">
          <h2>Tonight's showtimes</h2>
          <Link className="button ghost" to="/movies">All showtimes</Link>
        </div>
        <div className="schedule-grid modern">
          {showtimes.map((slot) => (
            <div className="schedule-row modern" key={`${slot.film}-${slot.time}`}>
              <div>
                <strong>{slot.film}</strong>
                <p>{slot.hall}</p>
              </div>
              <div className="schedule-right">
                <span className="tag ghost">{slot.tag}</span>
                <span className="time">{slot.time}</span>
                <span className="seat-count">{slot.seats}</span>
                <span className="price">{slot.price}</span>
                <Link className="button small" to="/booking/s1">Book</Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div id="experiences" className="container section">
        <div className="section-head">
          <h2>Experiences</h2>
          <span className="tag">Signature halls</span>
        </div>
        <div className="experience-grid">
          {experiences.map((item) => (
            <div className="experience-card" key={item.title}>
              <div className="experience-header">
                <h3>{item.title}</h3>
                <span className="tag ghost">{item.tag}</span>
              </div>
              <p>{item.copy}</p>
              <button className="button ghost">Learn more</button>
            </div>
          ))}
        </div>
      </div>

      <div id="offers" className="container section split">
        <div className="card promo neon-promo">
          <h2>Member lounge</h2>
          <p>Earn points, unlock priority seats, and get pre-sale alerts.</p>
          <ul className="promo-list">
            <li>Free upgrades on weekdays</li>
            <li>Priority entry lanes</li>
            <li>Birthday ticket credit</li>
          </ul>
          <button className="button secondary">Join now</button>
        </div>
        <div className="offers-block">
          <div className="section-head">
            <h2>Offers and deals</h2>
            <Link className="button ghost" to="/movies">Grab a ticket</Link>
          </div>
          <div className="offer-grid">
            {offers.map((offer) => (
              <div className="offer-card" key={offer.title}>
                <h3>{offer.title}</h3>
                <p>{offer.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="cinemas" className="container section">
        <div className="section-head">
          <h2>Cinemas</h2>
          <span className="tag">Sri Lanka</span>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <div className="card">
            <h3>TicketNest Multiplex</h3>
            <p>Level 4, TicketNest Mall, Colombo 4</p>
          </div>
          <div className="card">
            <h3>Galle City</h3>
            <p>Fort Road, Galle</p>
          </div>
          <div className="card">
            <h3>Kandy Central</h3>
            <p>Peradeniya Road, Kandy</p>
          </div>
        </div>
      </div>

      <div id="contact" className="container section">
        <div className="card">
          <div className="section-head">
            <h2>Contact</h2>
            <Link className="button ghost" to="/contact">Open page</Link>
          </div>
          <p>Call +94 11 200 7788 or email hello@kccmultiplex.lk</p>
        </div>
      </div>
    </section>
  );
}
