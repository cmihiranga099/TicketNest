export function AdminDashboard() {
  return (
    <section className="container grid" style={{ gap: 24 }}>
      <div className="card">
        <h2>Admin dashboard</h2>
        <p>Track bookings, manage movies, and analyze sales trends.</p>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <div className="card">
          <h3>Bookings today</h3>
          <p>142</p>
        </div>
        <div className="card">
          <h3>Revenue</h3>
          <p>$8,540</p>
        </div>
        <div className="card">
          <h3>Active users</h3>
          <p>1,264</p>
        </div>
      </div>
      <div className="card">
        <h3>Next actions</h3>
        <p>Review locked seats, approve new showtimes, and export weekly report.</p>
      </div>
    </section>
  );
}
