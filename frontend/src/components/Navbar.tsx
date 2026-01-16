import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <header className="navbar">
      <Link className="logo" to="/">
        TicketNest
      </Link>
      <nav>
        <Link to="/movies">Movies</Link>
        <Link to="/booking/s1">Book</Link>
        <Link to="/admin">Admin</Link>
        <Link className="button ghost" to="/auth">
          Sign In
        </Link>
      </nav>
    </header>
  );
}
