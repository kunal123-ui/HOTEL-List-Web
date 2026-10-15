import { useState, useEffect } from "react";
import { X, Lock, Mail, LogIn, CheckCircle2, Eye, EyeOff, AlertCircle } from "lucide-react";
import "./LoginModal.css";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setTouched({});
      setShowPassword(false);
      setSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function validate(fields = { email, password }) {
    const errs = {};

    const trimmedEmail = fields.email.trim();
    if (!trimmedEmail) {
      errs.email = "Email address is required.";
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      errs.email = "Please enter a valid email address (e.g. name@example.com).";
    }

    const trimmedPassword = fields.password.trim();
    if (!trimmedPassword) {
      errs.password = "Password is required.";
    } else if (trimmedPassword.length < 6) {
      errs.password = "Password must be at least 6 characters long.";
    }

    return errs;
  }

  function handleEmailChange(e) {
    const val = e.target.value;
    setEmail(val);
    if (touched.email) {
      const errs = validate({ email: val, password });
      setErrors((prev) => ({ ...prev, email: errs.email }));
    }
  }

  function handlePasswordChange(e) {
    const val = e.target.value;
    setPassword(val);
    if (touched.password) {
      const errs = validate({ email, password: val });
      setErrors((prev) => ({ ...prev, password: errs.password }));
    }
  }

  function handleEmailBlur() {
    setTouched((prev) => ({ ...prev, email: true }));
    const errs = validate({ email, password });
    setErrors((prev) => ({ ...prev, email: errs.email }));
  }

  function handlePasswordBlur() {
    setTouched((prev) => ({ ...prev, password: true }));
    const errs = validate({ email, password });
    setErrors((prev) => ({ ...prev, password: errs.password }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({ email: true, password: true });

    const errs = validate({ email, password });
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      onLogin({
        name: email.trim().split("@")[0] || "User",
        email: email.trim(),
      });
      setSuccess(false);
      onClose();
    }, 700);
  }

  function handleDemoLogin() {
    setEmail("kunal@havenandhills.com");
    setPassword("password123");
    setErrors({});
    setTouched({});
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
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="login-field">
              <label htmlFor="login-email">Email Address</label>
              <div
                className={`login-input-wrap ${
                  errors.email && touched.email ? "login-input-error" : ""
                }`}
              >
                <Mail size={16} />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  placeholder="name@example.com"
                  autoFocus
                  aria-invalid={errors.email && touched.email ? "true" : "false"}
                  aria-describedby={errors.email && touched.email ? "email-error" : undefined}
                />
              </div>
              {errors.email && touched.email && (
                <span id="email-error" className="login-field-error" role="alert">
                  <AlertCircle size={13} /> {errors.email}
                </span>
              )}
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Password</label>
              <div
                className={`login-input-wrap ${
                  errors.password && touched.password ? "login-input-error" : ""
                }`}
              >
                <Lock size={16} />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  placeholder="••••••••"
                  aria-invalid={errors.password && touched.password ? "true" : "false"}
                  aria-describedby={errors.password && touched.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  className="login-password-toggle-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && touched.password && (
                <span id="password-error" className="login-field-error" role="alert">
                  <AlertCircle size={13} /> {errors.password}
                </span>
              )}
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
