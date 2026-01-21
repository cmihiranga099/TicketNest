import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, getToken } from "../api/client";
import { getSocket } from "../api/socket";
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

type LocksResponse = {
  locked: string[];
  mine: string[];
};

export function Booking() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const [showtime, setShowtime] = useState<ShowtimeResponse["showtime"] | null>(null);
  const [seats, setSeats] = useState<SeatsResponse["seats"]>([]);
  const [booked, setBooked] = useState<string[]>([]);
  const [locked, setLocked] = useState<string[]>([]);
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
        const locksData = await api.request<LocksResponse>(`/showtimes/${showtimeId}/locks`);
        if (!mounted) {
          return;
        }
        setShowtime(showtimeData.showtime);
        setSeats(seatsData.seats);
        setBooked(bookedData.booked || []);
        setSelected(locksData.mine || []);
        setLocked((locksData.locked || []).filter((seatId) => !locksData.mine?.includes(seatId)));
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

  useEffect(() => {
    if (!showtimeId) {
      return;
    }
    const socket = getSocket();
    socket.emit("join_showtime", showtimeId);

    const handleLocks = (payload: { seatIds: string[] }) => {
      setLocked((prev) => {
        const next = new Set(prev);
        payload.seatIds.forEach((seatId) => {
          if (!selected.includes(seatId)) {
            next.add(seatId);
          }
        });
        return Array.from(next);
      });
    };

    const handleUnlocks = (payload: { seatIds: string[] }) => {
      setLocked((prev) => prev.filter((seatId) => !payload.seatIds.includes(seatId)));
    };

    const handleBooked = (payload: { seatIds: string[] }) => {
      setBooked((prev) => Array.from(new Set([...prev, ...payload.seatIds])));
      setLocked((prev) => prev.filter((seatId) => !payload.seatIds.includes(seatId)));
      setSelected((prev) => prev.filter((seatId) => !payload.seatIds.includes(seatId)));
    };

    socket.on("seat_locks", handleLocks);
    socket.on("seat_unlocks", handleUnlocks);
    socket.on("seat_booked", handleBooked);

    return () => {
      socket.off("seat_locks", handleLocks);
      socket.off("seat_unlocks", handleUnlocks);
      socket.off("seat_booked", handleBooked);
      socket.emit("leave_showtime", showtimeId);
    };
  }, [showtimeId, selected]);

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

  const lockSeat = async (seatId: string) => {
    if (!showtimeId) {
      return;
    }
    await api.request(`/showtimes/${showtimeId}/locks`, {
      method: "POST",
      body: JSON.stringify({ seat_ids: [seatId] })
    });
    setSelected((prev) => [...prev, seatId]);
    setLocked((prev) => prev.filter((lockedSeat) => lockedSeat !== seatId));
  };

  const unlockSeat = async (seatId: string) => {
    if (!showtimeId) {
      return;
    }
    await api.request(`/showtimes/${showtimeId}/locks`, {
      method: "DELETE",
      body: JSON.stringify({ seat_ids: [seatId] })
    });
    setSelected((prev) => prev.filter((seat) => seat !== seatId));
  };

  const toggleSeat = async (seatId: string) => {
    setError(null);
    try {
      if (selected.includes(seatId)) {
        await unlockSeat(seatId);
      } else {
        await lockSeat(seatId);
      }
    } catch (err) {
      setError((err as Error).message);
    }
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
        <div className="seat-legend">
          <span><i className="seat-dot available" />Available</span>
          <span><i className="seat-dot selected" />Selected</span>
          <span><i className="seat-dot locked" />Locked</span>
          <span><i className="seat-dot booked" />Booked</span>
        </div>
      </div>
      <div className="card">
        <SeatMap
          rows={seatRows}
          booked={booked}
          locked={locked}
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
