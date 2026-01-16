import { useState } from "react";
import { Link } from "react-router-dom";
import { api, setToken } from "../api/client";

export function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);
    try {
      const response = await api.request<{ accessToken: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          phone,
          password
        })
      });
      setToken(response.accessToken);
      setMessage("Account created.");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <section className="container grid" style={{ gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
      <div className="card">
        <h2>Create account</h2>
        <form className="form" onSubmit={(event) => event.preventDefault()}>
          <input
            className="input"
            placeholder="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <input
            className="input"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            className="input"
            placeholder="Phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          <input
            className="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button className="button secondary" type="button" onClick={handleRegister}>Register</button>
        </form>
        <p>
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </div>
      {message ? (
        <div className="card">
          <h3>Success</h3>
          <p>{message}</p>
        </div>
      ) : null}
      {error ? (
        <div className="card">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      ) : null}
    </section>
  );
}
