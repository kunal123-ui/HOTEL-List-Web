import { useEffect } from "react";
import { CheckCircle2, X, Trash2 } from "lucide-react";
import "./SuccessPopup.css";

export default function SuccessPopup({
  isOpen,
  title = "Deletion Successful!",
  message = "The hotel item has been successfully removed.",
  hotelTitle = "",
  onClose,
  duration = 4500,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="success-popup-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-popup-title"
      onClick={onClose}
    >
      <div
        className="success-popup-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="success-popup-icon-wrapper">
          <div className="success-popup-glow" />
          <CheckCircle2 size={40} className="success-popup-check" />
        </div>

        <div className="success-popup-content">
          <span className="success-popup-badge">
            <Trash2 size={13} />
            DELETED ITEM
          </span>
          <h3 id="success-popup-title">{title}</h3>
          <p className="success-popup-msg">{message}</p>
          {hotelTitle && (
            <div className="deleted-hotel-chip">
              <span className="chip-bullet"></span>
              <strong>{hotelTitle}</strong> has been deleted
            </div>
          )}
        </div>

        <button
          type="button"
          className="success-popup-close-btn"
          onClick={onClose}
          aria-label="Close popup"
        >
          <X size={18} />
        </button>

        <div className="success-popup-progress-bar" style={{ animationDuration: `${duration}ms` }} />
      </div>
    </div>
  );
}
