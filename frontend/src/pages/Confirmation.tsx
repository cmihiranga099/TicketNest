import { useEffect, useState } from "react";
import { api, getToken } from "../api/client";

type BookingResponse = {
  booking: {
    id: string;
    status: string;
    payment_status: string;
    booking_code?: string;
    total_amount_cents: number;
    created_at: string;
  };
};

export function Confirmation() {
  const confirmation = sessionStorage.getItem("ticketnest.booking");
  const data = confirmation ? JSON.parse(confirmation) : null;
  const [booking, setBooking] = useState<BookingResponse["booking"] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!data?.bookingId || !getToken()) {
        return;
      }
      try {
        const response = await api.request<BookingResponse>(`/bookings/${data.bookingId}`);
        if (mounted) {
          setBooking(response.booking);
        }
      } catch (err) {
        if (mounted) {
          setError((err as Error).message);
        }
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [data?.bookingId]);

  if (!data) {
    return <p>No confirmation found.</p>;
  }

  return (
    <section className="container grid" style={{ gap: 24 }}>
      <div className="card">
        <h2>Booking status</h2>
        {error ? <p>{error}</p> : null}
        <p>Status: {booking?.status || "PENDING"}</p>
        <p>Payment: {booking?.payment_status || "PENDING"}</p>
        <p>Booking code: <strong>{booking?.booking_code || "Generating"}</strong></p>
        <p>Movie: {data.movieTitle}</p>
        <p>Showtime: {new Date(data.startsAt).toLocaleString()}</p>
        <p>Seats: {data.seats.join(", ")}</p>
      </div>
    </section>
  );
}
