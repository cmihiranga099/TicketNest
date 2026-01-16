import { Link } from "react-router-dom";

const featured = [
  {
    title: "Solar Drift",
    genre: "Sci-Fi",
    runtime: "128 min",
    rating: "PG-13"
  },
  {
    title: "Midnight Deli",
    genre: "Drama",
    runtime: "102 min",
    rating: "PG"
  },
  {
    title: "Copper Crown",
    genre: "Adventure",
    runtime: "140 min",
    rating: "PG-13"
  }
];

const showtimes = [
  { film: "Solar Drift", hall: "Aurora Hall", time: "18:30", tag: "2D" },
  { film: "Midnight Deli", hall: "Echo Hall", time: "19:00", tag: "2D" },
  { film: "Copper Crown", hall: "Nova Hall", time: "20:15", tag: "Dolby" },
  { film: "Solar Drift", hall: "Nova Hall", time: "21:30", tag: "IMAX" }
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
  return (
    <section className="home">
      <div className="container hero-slate">
        <div className="hero-banner fade-up">
          <div className="badge">Colombo cinema nights</div>
          <h1 className="hero-title">TicketNest Multiplex</h1>
          <p className="hero-copy">
            Premium screens, live seat maps, and Stripe checkout. Find the show, lock the seats, scan in.
          </p>
          <div className="hero-actions">
            <Link className="button" to="/movies">Now showing</Link>
            <Link className="button secondary" to="/booking/s1">Book tickets</Link>
            <Link className="button ghost" to="/admin">Admin control</Link>
          </div>
        </div>
        <div className="quick-booking fade-up delay-1">
          <h3>Quick booking</h3>
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
          <button className="button full-width">Search showtimes</button>
        </div>
      </div>

      <div className="marquee">
        <div className="marquee-track">
          <span>Festival week deals</span>
          <span>Early bird matinee</span>
          <span>Dolby premiere nights</span>
          <span>Family combo offers</span>
          <span>Student discount</span>
        </div>
      </div>

      <div className="container section">
        <div className="section-head">
          <h2>Now showing</h2>
          <Link className="button ghost" to="/movies">View all</Link>
        </div>
        <div className="film-grid">
          {featured.map((film) => (
            <div className="film-card" key={film.title}>
              <div className="film-poster" />
              <div className="film-meta">
                <h3>{film.title}</h3>
                <p>{film.genre} - {film.runtime} - {film.rating}</p>
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
        <div className="schedule card">
          <div className="section-head">
            <h2>Today's showtimes</h2>
            <span className="tag">Live</span>
          </div>
          <div className="schedule-grid">
            {showtimes.map((slot) => (
              <div className="schedule-row" key={`${slot.film}-${slot.time}`}>
                <div>
                  <strong>{slot.film}</strong>
                  <p>{slot.hall}</p>
                </div>
                <div className="schedule-right">
                  <span className="tag ghost">{slot.tag}</span>
                  <span className="time">{slot.time}</span>
                  <Link className="button small" to="/booking/s1">Book</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card promo">
          <h2>Member lounge</h2>
          <p>Earn points, unlock priority seats, and get pre-sale alerts.</p>
          <ul className="promo-list">
            <li>Free upgrades on weekdays</li>
            <li>Priority entry lanes</li>
            <li>Birthday ticket credit</li>
          </ul>
          <button className="button secondary">Join now</button>
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

      <div id="offers" className="container section offers">
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
    </section>
  );
}