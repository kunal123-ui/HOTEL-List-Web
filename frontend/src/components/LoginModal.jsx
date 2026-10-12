import { useState } from "react";
import { X, Lock, Mail, LogIn, CheckCircle2 } from "lucide-react";
import "./LoginModal.css";

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      onLogin({
        name: email.split("@")[0] || "User",
        email: email.trim(),
      });
      setSuccess(false);
      onClose();
    }, 700);
  }

  function handleDemoLogin() {
    setEmail("kunal@havenandhills.com");
    setPassword("password123");
    setSuccess(true);
    setTimeout(() => {
      onLogin({
        name: "Kunal",
        email: "kunal@havenandhills.com",
      });
      setSuccess(false);
      onClose();
    }, 600);
  }

  return (
    <div className="login-modal-backdrop" onClick={onClose}>
      <div className="login-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="login-modal-close"
          onClick={onClose}
          aria-label="Close login dialog"
        >
          <X size={18} />
        </button>

        <div className="login-modal-header">
          <div className="login-modal-icon">
            <Lock size={22} />
          </div>
          <h3>Welcome Back</h3>
          <p>Sign in to manage your hotel listings and reservations.</p>
        </div>

        {success ? (
          <div className="login-success-state">
            <CheckCircle2 size={38} className="login-success-check" />
            <p>Signed in successfully!</p>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="login-error-msg">{error}</div>}

            <div className="login-field">
              <label htmlFor="login-email">Email Address</label>
              <div className="login-input-wrap">
                <Mail size={16} />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="name@example.com"
                  autoFocus
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Password</label>
              <div className="login-input-wrap">
                <Lock size={16} />
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="login-submit-btn">
              <LogIn size={16} /> Sign In
            </button>

            <button
              type="button"
              className="login-demo-btn"
              onClick={handleDemoLogin}
            >
              Quick Demo Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
