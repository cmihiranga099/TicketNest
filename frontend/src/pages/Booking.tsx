import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, getToken } from "../api/client";
import { SeatMap } from "../components/SeatMap";
import { Stepper } from "../components/Stepper";

type ShowtimeResponse = {
  showtime: {
    id: string;
    starts_at: string;
    base_price_cents: number;
    status: string;
    movie_title: string;
    hall_id: string;
    hall_name: string;
  };
};

type SeatsResponse = {
  seats: Array<{
    id: string;
    row_label: string;
    seat_number: number;
  }>;
};

type BookedSeatsResponse = {
  booked: string[];
};

export function Booking() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const [showtime, setShowtime] = useState<ShowtimeResponse["showtime"] | null>(null);
  const [seats, setSeats] = useState<SeatsResponse["seats"]>([]);
  const [booked, setBooked] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const steps = ["Movie", "Showtime", "Seats", "Payment"];

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!showtimeId) {
        return;
      }
      try {
        setLoading(true);
        const showtimeData = await api.request<ShowtimeResponse>(`/showtimes/${showtimeId}`);
        const seatsData = await api.request<SeatsResponse>(`/halls/${showtimeData.showtime.hall_id}/seats`);
        const bookedData = await api.request<BookedSeatsResponse>(`/bookings/showtimes/${showtimeId}/seats`);
        if (!mounted) {
          return;
        }
        setShowtime(showtimeData.showtime);
        setSeats(seatsData.seats);
        setBooked(bookedData.booked || []);
        setError(null);
      } catch (err) {
        if (!mounted) {
          return;
        }
        setError((err as Error).message);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [showtimeId]);

  const seatRows = useMemo(() => {
    const grouped: Record<string, Array<{ id: string; label: string; seat_number: number }>> = {};
    for (const seat of seats) {
      const label = `${seat.row_label}${seat.seat_number}`;
      if (!grouped[seat.row_label]) {
        grouped[seat.row_label] = [];
      }
      grouped[seat.row_label].push({ id: seat.id, label, seat_number: seat.seat_number });
    }
    return Object.keys(grouped)
      .sort()
      .map((rowLabel) => ({
        rowLabel,
        seats: grouped[rowLabel]
          .sort((a, b) => a.seat_number - b.seat_number)
          .map((seat) => ({ id: seat.id, label: seat.label }))
      }));
  }, [seats]);

  const seatLabels = useMemo(() => {
    const map: Record<string, string> = {};
    for (const seat of seats) {
      map[seat.id] = `${seat.row_label}${seat.seat_number}`;
    }
    return map;
  }, [seats]);

  const total = useMemo(() => {
    if (!showtime) {
      return 0;
    }
    return (showtime.base_price_cents / 100) * selected.length;
  }, [showtime, selected]);

  const toggleSeat = (seatId: string) => {
    setSelected((prev) =>
      prev.includes(seatId) ? prev.filter((seat) => seat !== seatId) : [...prev, seatId]
    );
  };

  const handleContinue = async () => {
    if (!showtimeId) {
      return;
    }
    try {
      const booking = await api.request<{ booking: { id: string; total_amount_cents: number } }>("/bookings/initiate", {
        method: "POST",
        body: JSON.stringify({ showtime_id: showtimeId, seat_ids: selected })
      });
      sessionStorage.setItem(
        "ticketnest.booking",
        JSON.stringify({
          bookingId: booking.booking.id,
          showtimeId,
          movieTitle: showtime?.movie_title,
          hall: showtime?.hall_name,
          startsAt: showtime?.starts_at,
          seats: selected.map((seatId) => seatLabels[seatId]),
          seatIds: selected,
          total: booking.booking.total_amount_cents / 100
        })
      );
      navigate("/checkout");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (!getToken()) {
    return (
      <section className="container card">
        <h2>Sign in required</h2>
        <p>Please sign in to reserve seats.</p>
        <Link className="button" to="/signin">Go to sign in</Link>
      </section>
    );
  }

  if (loading) {
    return <p>Loading showtime...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!showtime) {
    return <p>Showtime not found.</p>;
  }

  return (
    <section className="container grid" style={{ gap: 24 }}>
      <div className="card">
        <Stepper steps={steps} />
        <h2>Select seats for {showtime.movie_title}</h2>
        <p>{showtime.hall_name} - {new Date(showtime.starts_at).toLocaleString()}</p>
      </div>
      <div className="card">
        <SeatMap
          rows={seatRows}
          booked={booked}
          locked={[]}
          selected={selected}
          onToggle={toggleSeat}
        />
      </div>
      <div className="card">
        <h3>Selection summary</h3>
        <p>Seats: {selected.length ? selected.map((seatId) => seatLabels[seatId]).join(", ") : "None"}</p>
        <p>Total: ${total.toFixed(2)}</p>
        <button className="button" onClick={handleContinue} disabled={selected.length === 0}>
          Continue to payment
        </button>
      </div>
    </section>
  );
}
