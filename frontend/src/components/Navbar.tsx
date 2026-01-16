import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAdmin, subscribeAuthChange } from "../api/client";

export function Navbar() {
  const [showAdmin, setShowAdmin] = useState(isAdmin());

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
      <nav>
        <Link to="/">Home</Link>
        <Link className="button nav-cta" to="/booking/s1">Buy Tickets</Link>
        <Link to="/movies">Movies</Link>
        <a href="/#cinemas">Cinemas</a>
        <a href="/#contact">Contact Us</a>
        {showAdmin ? (
          <Link className="button ghost" to="/admin">Admin Control</Link>
        ) : (
          <Link className="button ghost" to="/signin">Sign In</Link>
        )}
      </nav>
    </header>
  );
}
