import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import chefsparkLogo from "../assets/chefspark.png";
import { registerUser, saveToken } from "../services/api.js";

const authPanelMotion = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
};

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
      <motion.section className="auth-panel" {...authPanelMotion}>
        <motion.div
          className="login-brand"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.38 }}
        >
          <div className="login-logo-placeholder" aria-label="ChefSpark logo">
            <img src={chefsparkLogo} alt="" aria-hidden="true" />
          </div>

          <h1>
            <span>CHEF</span>
            <span>SPARK</span>
          </h1>
          <p>Create your account</p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="form-stack"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.24, duration: 0.38 }}
        >
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
              <motion.button
                className="password-toggle"
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((currentValue) => !currentValue)}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? (
                  <EyeOff size={20} strokeWidth={1.9} aria-hidden="true" />
                ) : (
                  <Eye size={20} strokeWidth={1.9} aria-hidden="true" />
                )}
              </motion.button>
            </div>
          </label>

          <motion.button type="submit" disabled={isLoading} whileTap={{ scale: 0.97 }}>
            {isLoading ? "Creating account..." : "Create an Account"}
          </motion.button>
        </motion.form>

        <AnimatePresence>
          {message && (
            <motion.p
              className="message error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="auth-divider">
          <span></span>
          <strong>or</strong>
          <span></span>
        </div>

        <motion.button
          className="link-button"
          type="button"
          onClick={onShowLogin}
          whileTap={{ scale: 0.97 }}
        >
          Back to Sign In
        </motion.button>

        <p className="auth-terms">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.section>
    </main>
  );
}

export default RegisterPage;
