import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Plus, LogIn, LogOut, User } from "lucide-react";
import LoginModal from "./LoginModal";
import "./Navbar.css";

const USER_STORAGE_KEY = "haven_hills_user";

export default function Navbar() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) {
        setCurrentUser(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to read user from storage", e);
    }
  }, []);

  function handleLogin(userData) {
    setCurrentUser(userData);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } catch (e) {
      console.warn("Failed to save user to storage", e);
    }
  }

  function handleLogout() {
    setCurrentUser(null);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (e) {
      console.warn("Failed to remove user from storage", e);
    }
  }

  function handleAddClick(e) {
    e.preventDefault();
    navigate("/", { state: { openAdd: true } });
    const trigger = document.getElementById("btn-add-hotel-trigger");
    if (trigger) trigger.click();
  }

  return (
    <>
      <header className="site-header">
        <nav className="navbar" aria-label="Main navigation">
          <Link to="/" className="brand">
            <span className="brand-icon">
              <Building2 size={24} />
            </span>
            <span className="brand-text">
              <strong>Haven & Hills</strong>
              <small>YOUR NEXT STAY STARTS HERE</small>
            </span>
          </Link>

          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/">Explore Hotels</Link>
            <a href="mailto:contact@havenandhills.com">Contact</a>
          </div>

          <div className="nav-actions">
            {currentUser ? (
              <div className="nav-user-pill">
                <div className="nav-user-avatar">
                  <User size={14} />
                </div>
                <span className="nav-user-name">{currentUser.name}</span>
                <button
                  type="button"
                  className="nav-logout-btn"
                  onClick={handleLogout}
                  title="Sign Out"
                  aria-label="Sign out"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="nav-login-btn"
                onClick={() => setShowLoginModal(true)}
              >
                <LogIn size={15} />
                Log In
              </button>
            )}

            <button
              type="button"
              onClick={handleAddClick}
              className="nav-cta"
            >
              <Plus size={17} />
              Add Hotel
            </button>
          </div>
        </nav>
      </header>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </>
  );
}
