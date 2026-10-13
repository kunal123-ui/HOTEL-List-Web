import { AlertTriangle, X } from "lucide-react";
import { getImageUrl, DEFAULT_HOTEL_IMAGE } from "../services/hotelApi";
import "./DeleteConfirmModal.css";

export default function DeleteConfirmModal({
  isOpen,
  hotel,
  onConfirm,
  onCancel,
}) {
  if (!isOpen || !hotel) return null;

  return (
    <div
      className="delete-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      onClick={onCancel}
    >
      <div
        className="delete-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="delete-modal-close"
          onClick={onCancel}
          aria-label="Cancel deletion"
        >
          <X size={18} />
        </button>

        <div className="delete-modal-icon-badge">
          <AlertTriangle size={28} />
        </div>

        <h3 id="delete-modal-title">Delete Hotel Listing?</h3>
        <p className="delete-modal-warning">
          Are you sure you want to delete <strong>&ldquo;{hotel.title}&rdquo;</strong>? This
          will remove the property from your collection immediately.
        </p>

        <div className="delete-modal-summary">
          <img
            src={getImageUrl(hotel.image)}
            alt={hotel.title}
            className="delete-modal-thumb"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_HOTEL_IMAGE;
            }}
          />
          <div className="delete-modal-info">
            <span className="hotel-title-preview">{hotel.title}</span>
            <span className="hotel-price-preview">₹{Number(hotel.price).toLocaleString("en-IN")} / night</span>
            <span className="hotel-coords-preview">📍 {hotel.latitude}, {hotel.longitude}</span>
          </div>
        </div>

        <div className="delete-modal-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-confirm-delete"
            onClick={onConfirm}
          >
            Delete Listing
          </button>
        </div>
      </div>
    </div>
  );
}
