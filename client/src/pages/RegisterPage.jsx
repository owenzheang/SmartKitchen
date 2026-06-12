import { useState } from "react";
import { registerUser, saveToken } from "../services/api.js";

function RegisterPage({ onRegister, onShowLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const data = await registerUser(email, password);
      saveToken(data.token);
      onRegister();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <h1>SMARTKITCHEN</h1>
        <h2>Register</h2>

        <form onSubmit={handleSubmit} className="form-stack">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>

        {message && <p className="message error">{message}</p>}

        <button className="link-button" type="button" onClick={onShowLogin}>
          Back to login
        </button>
      </section>
    </main>
  );
}

export default RegisterPage;
