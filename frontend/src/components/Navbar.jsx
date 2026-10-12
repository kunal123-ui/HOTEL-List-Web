import { Link, useNavigate } from "react-router-dom";
import { Building2, Plus } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  function handleAddClick(e) {
    e.preventDefault();
    navigate("/", { state: { openAdd: true } });
    const trigger = document.getElementById("btn-add-hotel-trigger");
    if (trigger) trigger.click();
  }

  return (
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

        <button
          type="button"
          onClick={handleAddClick}
          className="nav-cta"
        >
          <Plus size={17} />
          Add Hotel
        </button>
      </nav>
    </header>
  );
}
