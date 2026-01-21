import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, isAdmin, setToken } from "../api/client";

export function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    try {
      const response = await api.request<{ accessToken: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      setToken(response.accessToken);
      if (isAdmin()) {
        navigate("/admin");
        return;
      }
      setMessage("Signed in successfully.");
      navigate("/");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <section className="container grid" style={{ gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
      <div className="card">
        <h2>Sign in</h2>
        <form className="form" onSubmit={(event) => event.preventDefault()}>
          <input
            className="input"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            className="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button className="button" type="button" onClick={handleLogin}>Sign in</button>
        </form>
        <p>
          New here? <Link to="/signup">Create an account</Link>
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
