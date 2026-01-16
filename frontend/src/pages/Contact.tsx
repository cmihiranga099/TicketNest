import { useState } from "react";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="container grid" style={{ gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
      <div className="card">
        <h2>Contact us</h2>
        <p>Reach the KCC Multiplex team for group bookings, feedback, or support.</p>
        <div className="grid" style={{ gap: 12 }}>
          <div>
            <strong>Phone</strong>
            <p>+94 11 200 7788</p>
          </div>
          <div>
            <strong>Email</strong>
            <p>hello@kccmultiplex.lk</p>
          </div>
          <div>
            <strong>Address</strong>
            <p>Level 4, KCC Mall, Colombo 4</p>
          </div>
        </div>
      </div>
      <div className="card">
        <h3>Send a message</h3>
        <form className="form" onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <input
            className="input"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <textarea
            className="input"
            placeholder="Message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
          />
          <button className="button" type="submit">Send message</button>
        </form>
        {submitted ? <p>Thanks! We will respond within 24 hours.</p> : null}
      </div>
    </section>
  );
}
