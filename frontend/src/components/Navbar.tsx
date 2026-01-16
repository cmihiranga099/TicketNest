import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <header className="navbar">
      <Link className="logo" to="/">
        TicketNest
      </Link>
      <nav>
        <a href="/#experiences">Experiences</a>
        <a href="/#offers">Offers</a>
        <Link to="/movies">Movies</Link>
        <Link to="/booking/s1">Book</Link>
        <Link className="button ghost" to="/auth">Sign In</Link>
      </nav>
    </header>
  );
}
