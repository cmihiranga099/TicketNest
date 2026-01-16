import { useState } from "react";
import { api, setToken } from "../api/client";

export function Auth() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    try {
      const response = await api.request<{ accessToken: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      setToken(response.accessToken);
      setMessage("Signed in successfully.");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleRegister = async () => {
    setError(null);
    try {
      const response = await api.request<{ accessToken: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          phone: registerPhone,
          password: registerPassword
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
        <h2>Sign in</h2>
        <form className="form" onSubmit={(event) => event.preventDefault()}>
          <input
            className="input"
            placeholder="Email"
            type="email"
            value={loginEmail}
            onChange={(event) => setLoginEmail(event.target.value)}
          />
          <input
            className="input"
            placeholder="Password"
            type="password"
            value={loginPassword}
            onChange={(event) => setLoginPassword(event.target.value)}
          />
          <button className="button" type="button" onClick={handleLogin}>Sign in</button>
        </form>
      </div>
      <div className="card">
        <h2>Create account</h2>
        <form className="form" onSubmit={(event) => event.preventDefault()}>
          <input
            className="input"
            placeholder="Name"
            value={registerName}
            onChange={(event) => setRegisterName(event.target.value)}
          />
          <input
            className="input"
            placeholder="Email"
            type="email"
            value={registerEmail}
            onChange={(event) => setRegisterEmail(event.target.value)}
          />
          <input
            className="input"
            placeholder="Phone"
            value={registerPhone}
            onChange={(event) => setRegisterPhone(event.target.value)}
          />
          <input
            className="input"
            placeholder="Password"
            type="password"
            value={registerPassword}
            onChange={(event) => setRegisterPassword(event.target.value)}
          />
          <button className="button secondary" type="button" onClick={handleRegister}>Register</button>
        </form>
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
