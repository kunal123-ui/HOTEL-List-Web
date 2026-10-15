import {
  Users,
  Bed,
  Maximize2,
  CalendarDays,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import "./RoomAvailability.css";

export default function RoomAvailability({
  rooms = [],
  hotel,
  checkIn,
  checkOut,
  nights = 1,
  adults = 2,
  childrenCount = 0,
  requestedRooms = 1,
  onSelectRoom,
}) {
  const totalGuests = Number(adults) + Number(childrenCount);

  return (
    <section
      id="room-availability"
      className="room-avail-section"
      aria-label="Room Availability and Rates"
    >
      <div className="room-avail-header">
        <div className="room-avail-title-box">
          <h2>Room Availability & Real-Time Rates</h2>
          <p>
            Choose from curated luxury room configurations for your scheduled stay
          </p>
        </div>

        <div className="room-avail-dates-pill">
          <CalendarDays size={16} />
          <span>
            <strong>{checkIn}</strong> to <strong>{checkOut}</strong> (
            {nights} night{nights > 1 ? "s" : ""}, {totalGuests} guest
            {totalGuests > 1 ? "s" : ""}, {requestedRooms} room
            {requestedRooms > 1 ? "s" : ""})
          </span>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="room-avail-demo-badge">
        <Sparkles size={16} />
        <span>
          <strong>Frontend Demonstration:</strong> Room inventory and reservation
          states are dynamically calculated in your browser based on selected dates and
          local storage.
        </span>
      </div>

      {/* Empty State */}
      {rooms.length === 0 ? (
        <div className="room-avail-empty">
          <h3>No Room Options Found</h3>
          <p>
            Try adjusting your dates, guest count, or room count to see available
            stays.
          </p>
        </div>
      ) : (
        /* Room Cards Grid */
        <div className="room-cards-grid">
          {rooms.map((room) => {
            const availabilityPct = Math.round(
              (room.availableRooms / room.totalRooms) * 100
            );

            return (
              <article key={room.id} className="room-card-item">
                {/* Image and Status Badge */}
                <div className="room-card-image-box">
                  <img
                    src={room.image}
                    alt={`${room.name} at ${hotel.title}`}
                    className="room-card-img"
                    loading="lazy"
                  />
                  <div className={`room-status-badge status-${room.statusColor}`}>
                    {room.statusColor === "green" && <CheckCircle2 size={13} />}
                    {room.statusColor === "orange" && <Clock size={13} />}
                    {room.statusColor === "red" && <XCircle size={13} />}
                    <span>{room.statusLabel}</span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="room-card-body">
                  <div className="room-card-main-info">
                    <div className="room-card-title-row">
                      <h3>{room.name}</h3>
                      <div className="room-specs-list">
                        <span className="room-spec-item" title="Maximum guests per room">
                          <Users size={15} /> Max {room.maxGuests} Guests / Room
                        </span>
                        <span className="room-spec-item">
                          <Bed size={15} /> {room.bedType}
                        </span>
                        <span className="room-spec-item">
                          <Maximize2 size={14} /> {room.size}
                        </span>
                      </div>
                      <p className="room-card-description">{room.description}</p>
                    </div>

                    {/* Inventory Gauge */}
                    <div className="room-inventory-box">
                      <div className="room-inventory-header">
                        <span>
                          <strong>{room.availableRooms}</strong> of{" "}
                          <strong>{room.totalRooms}</strong> rooms available
                        </span>
                        <span style={{ fontWeight: 700 }}>{availabilityPct}% Free</span>
                      </div>

                      <div className="room-inventory-bar-track">
                        <div
                          className={`room-inventory-bar-fill bar-${room.statusColor}`}
                          style={{ width: `${availabilityPct}%` }}
                        />
                      </div>

                      <div className="room-inventory-stats">
                        <span>
                          Total: <strong>{room.totalRooms}</strong>
                        </span>
                        <span>
                          Reserved: <strong>{room.reservedRooms}</strong>
                        </span>
                        <span>
                          Available: <strong>{room.availableRooms}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Room Amenities */}
                    <div className="room-amenity-pills">
                      {room.amenities.map((item, i) => (
                        <span key={i} className="room-pill">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sidebar / Price & CTA */}
                  <div className="room-card-side">
                    <div className="room-price-stack">
                      <span className="room-price-caption">Starting From</span>
                      <strong className="room-price-amount">
                        ₹{room.pricePerNight.toLocaleString("en-IN")}
                      </strong>
                      <span className="room-price-calc">
                        ₹{room.pricePerNight.toLocaleString("en-IN")} × {room.nights}{" "}
                        night{room.nights > 1 ? "s" : ""} × {room.requestedRooms}{" "}
                        room{room.requestedRooms > 1 ? "s" : ""}
                      </span>
                      <div className="room-price-total">
                        Total: ₹{room.totalPrice.toLocaleString("en-IN")}
                        <small style={{ display: "block", color: "#556c61", fontSize: "11px", fontWeight: 500 }}>
                          (Taxes & fees included)
                        </small>
                      </div>

                      {room.warningMessage && (
                        <div className="room-warning-banner" role="alert">
                          <AlertTriangle size={15} />
                          <span>{room.warningMessage}</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      className="btn-reserve-room"
                      disabled={!room.canReserve}
                      onClick={() => onSelectRoom(room)}
                      aria-label={`Reserve ${room.name} at ₹${room.totalPrice.toLocaleString("en-IN")}`}
                    >
                      {room.availableRooms === 0 ? (
                        "Fully Booked"
                      ) : !room.canReserve ? (
                        "Capacity Exceeded"
                      ) : (
                        <>
                          Reserve Room <ArrowRight size={15} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
