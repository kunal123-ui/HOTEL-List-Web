import { Link } from "react-router-dom";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";
import "./Footer.css";

function InstagramIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link to="/" className="footer-logo" aria-label="Haven & Hills">
            <img
              src="/logo.png"
              alt="Haven & Hills - Luxury Hotel Stays"
              className="footer-logo-img"
            />
          </Link>
          <p>
            Thoughtfully chosen stays for meaningful journeys and memorable experiences.
          </p>
          <a href="mailto:hello@example.com" className="footer-email">
            <Mail size={16} />
            hello@example.com
          </a>
        </div>

        <div className="footer-column">
          <h3>Explore</h3>
          <Link to="/">All Hotels</Link>
          <Link to="/#hotels">Discover Stays</Link>
          <Link to="/#hotels">Hotel Directory</Link>
        </div>

        <div className="footer-column">
          <h3>Information</h3>
          <a href="mailto:hello@example.com">About Us</a>
          <a href="mailto:hello@example.com">Contact</a>
          <a href="mailto:hello@example.com">Support</a>
        </div>

        <div className="footer-column">
          <h3>Stay Connected</h3>
          <p className="footer-location">
            <MapPin size={16} />
            Discover stays across India
          </p>
          <div className="social-links">
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <InstagramIcon size={18} />
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">
              <FacebookIcon size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Haven & Hills. All rights reserved.</span>
        <a href="#top" className="back-to-top">
          Back to top <ArrowUpRight size={15} />
        </a>
      </div>
    </footer>
  );
}
