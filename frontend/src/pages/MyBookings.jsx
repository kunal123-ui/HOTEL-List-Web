import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  CalendarDays,
  CalendarCheck,
  Users,
  Bed,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Building,
  Info,
  Ban,
} from "lucide-react";
import {
  getStoredBookings,
  cancelDemoBooking,
} from "../utils/roomMockData";
import "./MyBookings.css";

export default function MyBookings() {
  const [bookings, setBookings] = useState(() => getStoredBookings());
  const [bookingToCancel, setBookingToCancel] = useState(null);

  useEffect(() => {
    function handleUpdate() {
      setBookings(getStoredBookings());
    }

    window.addEventListener("haven_hills_bookings_updated", handleUpdate);
    return () => {
      window.removeEventListener("haven_hills_bookings_updated", handleUpdate);
    };
  }, []);

  const totalBookings = bookings.length;
  const activeBookings = bookings.filter((b) => b.status !== "Cancelled").length;
  const cancelledBookings = bookings.filter((b) => b.status === "Cancelled").length;

  function handleConfirmCancel() {
    if (!bookingToCancel) return;
    cancelDemoBooking(bookingToCancel.id);
    setBookingToCancel(null);
  }

  return (
    <>
      <Helmet>
        <title>My Reservations | Haven & Hills Luxury Stays</title>
        <meta
          name="description"
          content="View, manage and cancel your simulated luxury hotel reservations."
        />
      </Helmet>

      <div className="bookings-page">
        {/* Breadcrumb */}
        <nav className="bookings-breadcrumb">
          <Link to="/" className="bookings-back-link">
            <ArrowLeft size={16} /> Back to All Hotels
          </Link>
        </nav>

        {/* Header */}
        <header className="bookings-header">
          <h1>My Reservations</h1>
          <p>
            Track and manage your simulated bookings for Haven &amp; Hills properties
          </p>
        </header>

        {/* Stats Row */}
        <div className="bookings-stats-row">
          <div className="booking-stat-card">
            <div className="booking-stat-icon">
              <CalendarCheck size={22} />
            </div>
            <div className="booking-stat-info">
              <small>Total Bookings</small>
              <strong>{totalBookings}</strong>
            </div>
          </div>

          <div className="booking-stat-card">
            <div className="booking-stat-icon" style={{ background: "#eaf7ee", color: "#19783f" }}>
              <CheckCircle2 size={22} />
            </div>
            <div className="booking-stat-info">
              <small>Active Stays</small>
              <strong>{activeBookings}</strong>
            </div>
          </div>

          <div className="booking-stat-card">
            <div className="booking-stat-icon" style={{ background: "#f8fafc", color: "#64748b" }}>
              <XCircle size={22} />
            </div>
            <div className="booking-stat-info">
              <small>Cancelled</small>
              <strong>{cancelledBookings}</strong>
            </div>
          </div>
        </div>

        {/* Demo Mode Notice */}
        <div className="bookings-demo-notice">
          <Info size={20} />
          <div>
            <strong>Frontend Simulation Mode</strong>
            <p>
              These demo reservations are saved locally in your browser storage.
              Cancelling a reservation immediately releases the rooms back to the
              hotel availability pool.
            </p>
          </div>
        </div>

        {/* Bookings List or Empty State */}
        {bookings.length === 0 ? (
          <div className="bookings-empty-state">
            <div className="bookings-empty-icon">
              <CalendarDays size={36} />
            </div>
            <h3>No Reservations Found</h3>
            <p>
              You haven&apos;t booked any stays yet. Explore our luxury resorts and
              boutique hotels to experience the interactive reservation UI.
            </p>
            <Link to="/" className="btn-explore-hotels">
              <Building size={16} /> Explore Luxury Hotels
            </Link>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => {
              const isCancelled = booking.status === "Cancelled";

              return (
                <article
                  key={booking.id}
                  className={`booking-item-card ${isCancelled ? "is-cancelled" : ""}`}
                >
                  {/* Thumbnail & Status */}
                  <div className="booking-item-media">
                    <img
                      src={booking.roomImage || booking.hotelImage}
                      alt={booking.roomName}
                      className="booking-item-img"
                    />
                    <div
                      className={`booking-status-tag ${
                        isCancelled ? "status-cancelled" : "status-confirmed"
                      }`}
                    >
                      {isCancelled ? <XCircle size={12} /> : <CheckCircle2 size={12} />}
                      <span>{booking.status}</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="booking-item-body">
                    <div className="booking-item-main">
                      <div className="booking-ref-bar">
                        <span className="booking-ref-badge">
                          REF: {booking.bookingReference}
                        </span>
                        <span className="booking-date-booked">
                          Booked on{" "}
                          {booking.createdAt
                            ? new Date(booking.createdAt).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Recent"}
                        </span>
                      </div>

                      <h2 className="booking-hotel-title">
                        <Link to={`/hotels/${booking.hotelId}`}>
                          {booking.hotelTitle}
                        </Link>
                      </h2>

                      <div className="booking-room-type">{booking.roomName}</div>

                      {/* Details Grid */}
                      <div className="booking-details-grid">
                        <div className="booking-detail-cell">
                          <CalendarDays size={16} />
                          <div>
                            <small>CHECK-IN</small>
                            <span>{booking.checkIn}</span>
                          </div>
                        </div>

                        <div className="booking-detail-cell">
                          <CalendarDays size={16} />
                          <div>
                            <small>CHECK-OUT ({booking.nights}N)</small>
                            <span>{booking.checkOut}</span>
                          </div>
                        </div>

                        <div className="booking-detail-cell">
                          <Users size={16} />
                          <div>
                            <small>GUESTS</small>
                            <span>
                              {booking.adults} Adults
                              {booking.children > 0 ? `, ${booking.children} Kids` : ""}
                            </span>
                          </div>
                        </div>

                        <div className="booking-detail-cell">
                          <Bed size={16} />
                          <div>
                            <small>ACCOMMODATION</small>
                            <span>
                              {booking.rooms} Room{booking.rooms > 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sidebar / Price & Actions */}
                    <div className="booking-item-side">
                      <div className="booking-price-group">
                        <small>Total Stay Price</small>
                        <strong className="booking-total-price">
                          ₹{Number(booking.totalPrice).toLocaleString("en-IN")}
                        </strong>
                        <span className="booking-tax-note">Taxes & fees included</span>
                      </div>

                      {!isCancelled ? (
                        <button
                          type="button"
                          className="btn-cancel-booking"
                          onClick={() => setBookingToCancel(booking)}
                          aria-label={`Cancel reservation ${booking.bookingReference}`}
                        >
                          <Ban size={14} /> Cancel Reservation
                        </button>
                      ) : (
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#64748b",
                            fontStyle: "italic",
                            marginTop: "12px",
                          }}
                        >
                          Cancelled on{" "}
                          {booking.cancelledAt
                            ? new Date(booking.cancelledAt).toLocaleDateString()
                            : "Earlier"}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Cancel Confirmation Dialog */}
        {bookingToCancel && (
          <div
            className="cancel-dialog-overlay"
            role="alertdialog"
            aria-labelledby="cancel-dialog-title"
          >
            <div className="cancel-dialog-box">
              <div className="cancel-dialog-icon">
                <AlertTriangle size={28} />
              </div>
              <h3 id="cancel-dialog-title">Cancel Reservation?</h3>
              <p>
                Are you sure you want to cancel booking{" "}
                <strong>{bookingToCancel.bookingReference}</strong> at{" "}
                <strong>{bookingToCancel.hotelTitle}</strong>?
                <br />
                <br />
                The reserved rooms will immediately be returned to the live
                availability pool.
              </p>
              <div className="cancel-dialog-actions">
                <button
                  type="button"
                  className="btn-dialog-abort"
                  onClick={() => setBookingToCancel(null)}
                >
                  Keep Reservation
                </button>
                <button
                  type="button"
                  className="btn-dialog-confirm-cancel"
                  onClick={handleConfirmCancel}
                >
                  Yes, Cancel Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
