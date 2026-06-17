import { useState } from "react";
import { ChefHat, Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
import { registerUser, saveToken } from "../services/api.js";

function RegisterPage({ onRegister, onShowLogin }) {
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
        <div className="login-brand">
          <div className="login-logo-placeholder" aria-label="SMARTKITCHEN logo placeholder">
            <ChefHat size={38} strokeWidth={2.4} aria-hidden="true" />
            <span className="logo-spark" aria-hidden="true">
              <Sparkles size={13} strokeWidth={2.4} />
            </span>
          </div>

          <h1>
            <span>SMART</span>
            <span>KITCHEN</span>
          </h1>
          <p>Create your kitchen account</p>
        </div>

        <form onSubmit={handleSubmit} className="form-stack">
          <label className="auth-field">
            Email address
            <div className="input-shell">
              <Mail size={22} strokeWidth={1.9} aria-hidden="true" />
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
              <Lock size={22} strokeWidth={1.9} aria-hidden="true" />
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
                {showPassword ? (
                  <EyeOff size={20} strokeWidth={1.9} aria-hidden="true" />
                ) : (
                  <Eye size={20} strokeWidth={1.9} aria-hidden="true" />
                )}
              </button>
            </div>
          </label>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create an Account"}
          </button>
        </form>

        {message && <p className="message error">{message}</p>}

        <div className="auth-divider">
          <span></span>
          <strong>or</strong>
          <span></span>
        </div>

        <button className="link-button" type="button" onClick={onShowLogin}>
          Back to Sign In
        </button>

        <p className="auth-terms">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;
