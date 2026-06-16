import { useState } from "react";
import { loginUser, saveToken } from "../services/api.js";

function LoginPage({ onLogin, onShowRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const data = await loginUser(email, password);
      saveToken(data.token);
      onLogin();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="login-brand">
          <div className="login-logo-placeholder" aria-label="SMARTKITCHEN logo placeholder">
            <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
              <path d="M15 23.5c-3.2-.8-5.5-3.5-5.5-6.8 0-3.9 3.2-7.1 7.1-7.1 1.2 0 2.3.3 3.3.8A8.6 8.6 0 0 1 36.3 14c3.5.9 6.2 4 6.2 7.8 0 3.5-2.2 6.5-5.3 7.6V39H15V23.5Z" />
              <path d="M15 31h22M15 36h22" />
            </svg>
            <span className="logo-spark" aria-hidden="true">+</span>
          </div>

          <h1>
            <span>SMART</span>
            <span>KITCHEN</span>
          </h1>
          <p>Cook smarter, every day</p>
        </div>

        <form onSubmit={handleSubmit} className="form-stack">
          <label className="auth-field">
            Email address
            <div className="input-shell">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 6h16v12H4z" />
                <path d="m4 7 8 6 8-6" />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
          </label>

          <label className="auth-field">
            Password
            <div className="input-shell">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 11V8a5 5 0 0 1 10 0v3" />
                <path d="M5 11h14v9H5z" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                required
              />
              <button
                className="password-toggle"
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((currentValue) => !currentValue)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  {showPassword ? (
                    <>
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                      <path d="M7.4 7.8C5.6 8.8 4.1 10.3 3 12c2.1 3.2 5.4 5 9 5 1.4 0 2.7-.3 3.9-.8" />
                      <path d="M13.8 7.2C17 7.8 19.6 9.5 21 12c-.5.8-1.2 1.6-1.9 2.2" />
                    </>
                  ) : (
                    <>
                      <path d="M3 12c2.1-3.2 5.4-5 9-5s6.9 1.8 9 5c-2.1 3.2-5.4 5-9 5s-6.9-1.8-9-5Z" />
                      <path d="M12 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </label>

          <button className="forgot-link" type="button">
            Forgot password?
          </button>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {message && <p className="message error">{message}</p>}

        <div className="auth-divider">
          <span></span>
          <strong>or</strong>
          <span></span>
        </div>

        <button className="link-button" type="button" onClick={onShowRegister}>
          Create an Account
        </button>

        <p className="auth-terms">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
