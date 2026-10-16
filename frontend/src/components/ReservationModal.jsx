import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Calendar,
  Users,
  Bed,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { saveDemoBooking } from "../utils/roomMockData";
import "./ReservationModal.css";

export default function ReservationModal({
  isOpen,
  onClose,
  hotel,
  room,
  onBookingSuccess,
}) {
  const navigate = useNavigate();
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!isOpen || !room || !hotel) return null;

  function handleConfirm(e) {
    e.preventDefault();
    setIsSubmitting(true);

    const bookingPayload = {
      hotelId: String(hotel.id),
      hotelTitle: hotel.title,
      hotelImage: hotel.image,
      hotelCity: hotel.city || "Tamil Nadu, India",
      roomTypeId: room.id,
      roomName: room.name,
      roomImage: room.image,
      checkIn: room.checkIn,
      checkOut: room.checkOut,
      nights: room.nights,
      adults: room.adults,
      children: room.children,
      rooms: room.requestedRooms,
      pricePerNight: room.pricePerNight,
      totalPrice: room.totalPrice,
      guestName: guestName.trim() || "Guest Traveler",
      guestEmail: guestEmail.trim() || "guest@example.com",
      guestPhone: guestPhone.trim() || "+91 98765 43210",
      specialRequests: specialRequests.trim(),
    };

    setTimeout(() => {
      const created = saveDemoBooking(bookingPayload);
      setConfirmedBooking(created);
      setIsSubmitting(false);
      if (onBookingSuccess) {
        onBookingSuccess(created);
      }
    }, 400);
  }

  function handleCloseModal() {
    setConfirmedBooking(null);
    onClose();
  }

  function handleGoToBookings() {
    handleCloseModal();
    navigate("/bookings");
  }

  return (
    <div
      className="res-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="res-modal-title"
    >
      <div className="res-modal-dialog">
        {/* Header */}
        <div className="res-modal-header">
          <div className="res-modal-title-group">
            <h2 id="res-modal-title">
              {confirmedBooking ? "Reservation Confirmed" : "Confirm Room Reservation"}
            </h2>
            <p>
              {confirmedBooking
                ? "Your reservation is successfully registered"
                : "Review your stay details before confirming"}
            </p>
          </div>
          <button
            type="button"
            className="res-modal-close-btn"
            onClick={handleCloseModal}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="res-modal-body">
          {confirmedBooking ? (
            /* Success State */
            <div className="res-success-view">
              <div className="res-success-icon-wrap">
                <CheckCircle2 size={42} />
              </div>
              <h2>Booking Confirmed!</h2>
              <p className="success-subtitle">
                Thank you! Your stay at <strong>{hotel.title}</strong> is reserved.
              </p>

              <div className="res-ref-card">
                <div className="res-ref-label">Booking Reference ID</div>
                <div className="res-ref-number">{confirmedBooking.bookingReference}</div>
              </div>

              <div className="res-success-details">
                <div className="res-success-details-row">
                  <span>Property</span>
                  <strong>{hotel.title}</strong>
                </div>
                <div className="res-success-details-row">
                  <span>Room Type</span>
                  <strong>{room.name}</strong>
                </div>
                <div className="res-success-details-row">
                  <span>Check-in</span>
                  <strong>{room.checkIn}</strong>
                </div>
                <div className="res-success-details-row">
                  <span>Check-out</span>
                  <strong>{room.checkOut} ({room.nights} night{room.nights > 1 ? "s" : ""})</strong>
                </div>
                <div className="res-success-details-row">
                  <span>Guests & Rooms</span>
                  <strong>
                    {room.adults} Adults{room.children > 0 ? `, ${room.children} Children` : ""} · {room.requestedRooms} Room{room.requestedRooms > 1 ? "s" : ""}
                  </strong>
                </div>
                <div className="res-success-details-row">
                  <span>Total Amount</span>
                  <strong style={{ color: "#123329", fontSize: "16px" }}>
                    ₹{room.totalPrice.toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>

              <div className="res-success-actions">
                <button
                  type="button"
                  className="btn-view-bookings"
                  onClick={handleGoToBookings}
                >
                  View in My Bookings <ArrowRight size={15} />
                </button>
                <button
                  type="button"
                  className="btn-close-success"
                  onClick={handleCloseModal}
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Confirmation Form */
            <form onSubmit={handleConfirm}>
              {/* Summary Card */}
              <div className="res-summary-card">
                <img
                  src={room.image}
                  alt={room.name}
                  className="res-summary-image"
                />
                <div className="res-summary-details">
                  <span className="res-hotel-name">{hotel.title}</span>
                  <h3 className="res-room-name">{room.name}</h3>
                  <span className="res-room-meta">
                    {room.bedType} · {room.size} · Max {room.maxGuests} guests/room
                  </span>
                </div>
              </div>

              {/* Stay Details Grid */}
              <div className="res-info-grid">
                <div className="res-info-item">
                  <div className="res-info-item-icon">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <small>DATES ({room.nights} NIGHTS)</small>
                    <strong>
                      {room.checkIn} → {room.checkOut}
                    </strong>
                  </div>
                </div>

                <div className="res-info-item">
                  <div className="res-info-item-icon">
                    <Users size={18} />
                  </div>
                  <div>
                    <small>OCCUPANCY</small>
                    <strong>
                      {room.adults} Adults
                      {room.children > 0 ? `, ${room.children} Children` : ""}
                    </strong>
                  </div>
                </div>

                <div className="res-info-item">
                  <div className="res-info-item-icon">
                    <Bed size={18} />
                  </div>
                  <div>
                    <small>ROOMS REQUESTED</small>
                    <strong>
                      {room.requestedRooms} {room.name}
                      {room.requestedRooms > 1 ? "s" : ""}
                    </strong>
                  </div>
                </div>

                <div className="res-info-item">
                  <div className="res-info-item-icon">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <small>CANCELLATION POLICY</small>
                    <strong>Free Cancellation</strong>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="res-pricing-box">
                <div className="res-pricing-row">
                  <span>
                    ₹{room.pricePerNight.toLocaleString("en-IN")} × {room.nights}{" "}
                    night{room.nights > 1 ? "s" : ""} × {room.requestedRooms}{" "}
                    room{room.requestedRooms > 1 ? "s" : ""}
                  </span>
                  <strong>₹{room.totalPrice.toLocaleString("en-IN")}</strong>
                </div>
                <div className="res-pricing-row">
                  <span>Taxes & Service Fees (Included)</span>
                  <span style={{ color: "#19783f", fontWeight: 600 }}>₹0.00</span>
                </div>
                <div className="res-pricing-row total-row">
                  <span>Total Estimated Price</span>
                  <strong>₹{room.totalPrice.toLocaleString("en-IN")}</strong>
                </div>
              </div>

              {/* Guest Details Form */}
              <div className="res-form-section">
                <h3>Primary Guest Information</h3>
                <div className="res-form-grid">
                  <div className="res-form-group">
                    <label htmlFor="res-guest-name">Full Name *</label>
                    <input
                      id="res-guest-name"
                      type="text"
                      placeholder="e.g. John Doe"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="res-form-group">
                    <label htmlFor="res-guest-email">Email Address *</label>
                    <input
                      id="res-guest-email"
                      type="email"
                      placeholder="e.g. john@example.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="res-form-group">
                    <label htmlFor="res-guest-phone">Phone Number</label>
                    <input
                      id="res-guest-phone"
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                    />
                  </div>

                  <div className="res-form-group">
                    <label htmlFor="res-guest-requests">Special Requests (Optional)</label>
                    <input
                      id="res-guest-requests"
                      type="text"
                      placeholder="e.g. High floor, quiet room"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="res-modal-actions">
                <button
                  type="button"
                  className="btn-res-cancel"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-res-confirm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Reserving..." : "Confirm Reservation"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
