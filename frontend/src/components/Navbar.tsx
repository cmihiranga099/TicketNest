import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAdmin, subscribeAuthChange } from "../api/client";

export function Navbar() {
  const [showAdmin, setShowAdmin] = useState(isAdmin());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => setShowAdmin(isAdmin());
    const unsubscribe = subscribeAuthChange(update);
    return unsubscribe;
  }, []);

  return (
    <header className="navbar">
      <Link className="logo" to="/">
        TicketNest
      </Link>
      <button
        className="nav-toggle"
        type="button"
        aria-controls="primary-nav"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
        <span className={`nav-icon ${menuOpen ? "open" : ""}`} aria-hidden="true">
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </span>
      </button>
      <nav id="primary-nav" className={menuOpen ? "open" : ""}>
        <Link to="/">Home</Link>
        <Link className="button nav-cta" to="/booking/s1">Buy Tickets</Link>
        <Link to="/movies">Movies</Link>
        <a href="/#cinemas">Cinemas</a>
        <Link to="/contact">Contact Us</Link>
        {showAdmin ? (
          <Link className="button ghost" to="/admin">Admin Control</Link>
        ) : (
          <Link className="button ghost" to="/signin">Sign In</Link>
        )}
      </nav>
    </header>
  );
}
