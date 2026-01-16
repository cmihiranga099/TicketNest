import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getToken } from "../api/client";

export function Checkout() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const booking = sessionStorage.getItem("ticketnest.booking");
  const data = booking ? JSON.parse(booking) : null;

  if (!getToken()) {
    return <p>Please sign in to complete payment.</p>;
  }

  if (!data) {
    return <p>No booking selected.</p>;
  }

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.request<{ payment_url: string }>("/payments/create", {
        method: "POST",
        body: JSON.stringify({ booking_id: data.bookingId, provider: "stripe" })
      });
      window.location.href = response.payment_url;
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/booking/${data.showtimeId}`);
  };

  return (
    <section className="container grid" style={{ gap: 24 }}>
      <div className="card">
        <h2>Checkout</h2>
        <p>{data.movieTitle}</p>
        <p>{data.hall} - {new Date(data.startsAt).toLocaleString()}</p>
        <p>Seats: {data.seats.join(", ")}</p>
        <p>Total: ${data.total.toFixed(2)}</p>
      </div>
      <div className="card">
        <h3>Payment</h3>
        {error ? <p>{error}</p> : null}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="button" onClick={handlePay} disabled={loading}>
            {loading ? "Redirecting..." : "Pay with Stripe"}
          </button>
          <button className="button ghost" onClick={handleBack} disabled={loading}>
            Change seats
          </button>
        </div>
      </div>
    </section>
  );
}
