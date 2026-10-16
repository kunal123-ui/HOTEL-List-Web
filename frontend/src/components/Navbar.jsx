import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Plus, LogIn, LogOut, User } from "lucide-react";
import LoginModal from "./LoginModal";
import { getStoredBookings } from "../utils/roomMockData";
import "./Navbar.css";

const USER_STORAGE_KEY = "haven_hills_user";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [bookingCount, setBookingCount] = useState(() => {
    return getStoredBookings().filter((b) => b.status !== "Cancelled").length;
  });

  useEffect(() => {
    function updateCount() {
      setBookingCount(
        getStoredBookings().filter((b) => b.status !== "Cancelled").length
      );
    }
    window.addEventListener("haven_hills_bookings_updated", updateCount);
    return () => {
      window.removeEventListener("haven_hills_bookings_updated", updateCount);
    };
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

  function handleHomeClick(e) {
    e.preventDefault();
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (window.location.hash) {
        window.history.pushState(null, "", "/");
      }
    } else {
      navigate("/");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  }

  function handleExploreClick(e) {
    e.preventDefault();
    if (location.pathname === "/") {
      const el = document.getElementById("hotels");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      window.history.pushState(null, "", "/#hotels");
    } else {
      navigate("/#hotels", { state: { scrollTo: "hotels" } });
    }
  }

  function handleContactClick(e) {
    e.preventDefault();
    const footer =
      document.getElementById("footer") ||
      document.getElementById("contact") ||
      document.querySelector(".site-footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
    window.history.pushState(null, "", "#footer");
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
          <Link
            to="/"
            className="brand"
            aria-label="Haven & Hills"
            onClick={handleHomeClick}
          >
            <img
              src="/logo.png"
              alt="Haven & Hills - Luxury Hotel Stays"
              className="brand-logo-img"
            />
          </Link>

          <div className="nav-links">
            <a href="/" onClick={handleHomeClick}>
              Home
            </a>
            <a href="/#hotels" onClick={handleExploreClick}>
              Explore Hotels
            </a>
            <Link to="/bookings" className="nav-bookings-link">
              <span>Bookings</span>
              {bookingCount > 0 && (
                <span className="nav-bookings-count-pill">{bookingCount}</span>
              )}
            </Link>
            <a href="#footer" onClick={handleContactClick}>
              Contact
            </a>
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
