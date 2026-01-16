import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Movies } from "./pages/Movies";
import { MovieDetail } from "./pages/MovieDetail";
import { Booking } from "./pages/Booking";
import { Checkout } from "./pages/Checkout";
import { Confirmation } from "./pages/Confirmation";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Auth } from "./pages/Auth";

export function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/booking/:showtimeId" element={<Booking />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
