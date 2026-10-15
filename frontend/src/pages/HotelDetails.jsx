import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  MapPin,
  ShieldCheck,
  Coffee,
  Wifi,
  Share2,
  CalendarCheck,
  Check,
  Bed,
  Trees,
  Compass,
  CalendarDays,
  AlertCircle,
} from "lucide-react";
import { fetchHotelById } from "../services/hotelApi";
import { fetchHotelsAsync } from "../redux/hotelSlice";
import HotelImageSlider from "../components/HotelImageSlider";
import HotelMap from "../components/HotelMap";
import ReservationModal from "../components/ReservationModal";
import {
  getTodayString,
  getTomorrowString,
  calculateNights,
  ROOM_TYPES,
} from "../utils/roomMockData";
import "./HotelDetails.css";

export default function HotelDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [fetchedHotel, setFetchedHotel] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  // Booking search form state
  const [checkIn, setCheckIn] = useState(() => getTodayString());
  const [checkOut, setCheckOut] = useState(() => getTomorrowString());
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomsCount, setRoomsCount] = useState(1);
  const [roomType, setRoomType] = useState("all");
  const [dateError, setDateError] = useState("");
  const [selectedRoomForModal, setSelectedRoomForModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingSuccessAlert, setBookingSuccessAlert] = useState(null);
  const [, setRefreshTrigger] = useState(0);

  const reduxHotel = useSelector((state) =>
    state.hotels.hotels.find((item) => String(item.id) === String(id))
  );
  const hotel = reduxHotel || fetchedHotel;

  useEffect(() => {
    function handleBookingUpdate() {
      setRefreshTrigger((prev) => prev + 1);
    }
    window.addEventListener("haven_hills_bookings_updated", handleBookingUpdate);
    return () => {
      window.removeEventListener("haven_hills_bookings_updated", handleBookingUpdate);
    };
  }, []);

  const minCheckIn = getTodayString();
  const getMinCheckOut = (inDate) => {
    const d = new Date(inDate);
    d.setDate(d.getDate() + 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  function handleCheckInChange(e) {
    const newIn = e.target.value;
    setCheckIn(newIn);
    if (checkOut <= newIn) {
      setCheckOut(getMinCheckOut(newIn));
    }
    setDateError("");
  }

  function handleCheckOutChange(e) {
    const newOut = e.target.value;
    if (newOut <= checkIn) {
      setDateError("Check-out date must be later than check-in date.");
    } else {
      setDateError("");
    }
    setCheckOut(newOut);
  }

  const nights = calculateNights(checkIn, checkOut);

  // Price estimation
  const selectedMultiplier =
    roomType === "all"
      ? 1.0
      : ROOM_TYPES[roomType]?.priceMultiplier || 1.0;
  const baseRatePerNight = Math.round(Number(hotel?.price || 4500) * selectedMultiplier);
  const estimatedTotalPrice = baseRatePerNight * nights * Number(roomsCount);

  function handleSidebarReserve(e) {
    if (e) e.preventDefault();
    if (checkOut <= checkIn) {
      setDateError("Please choose a valid check-out date.");
      return;
    }
    setDateError("");

    const selectedKey = roomType === "all" ? "deluxe" : roomType;
    const roomInfo = ROOM_TYPES[selectedKey] || ROOM_TYPES.deluxe;

    const roomPayload = {
      ...roomInfo,
      pricePerNight: baseRatePerNight,
      totalPrice: estimatedTotalPrice,
      nights,
      requestedRooms: Number(roomsCount),
      adults: Number(adults),
      children: Number(children),
      checkIn,
      checkOut,
    };

    setSelectedRoomForModal(roomPayload);
    setIsModalOpen(true);
  }

  function handleBookingSuccess(created) {
    setBookingSuccessAlert(created);
    setTimeout(() => {
      setBookingSuccessAlert(null);
    }, 6000);
  }
  useEffect(() => {
    if (!reduxHotel && id) {
      setIsFetching(true);
      fetchHotelById(id)
        .then((res) => {
          if (res?.data) {
            setFetchedHotel(res.data);
          }
        })
        .catch(() => {
          dispatch(fetchHotelsAsync());
        })
        .finally(() => {
          setIsFetching(false);
        });
    }
  }, [id, reduxHotel, dispatch]);
  function handleShare() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedNotice(true);
      setTimeout(() => setCopiedNotice(false), 3000);
    }
  }
  if (isFetching && !hotel) {
    return (
      <main className="details-container">
        <div className="details-loading-skeleton">
          <div className="skeleton-hero" />
          <div className="skeleton-text" />
          <div className="skeleton-text short" />
        </div>
      </main>
    );
  }
  if (!hotel) {
    return (
      <main className="details-container not-found-view">
        <Helmet>
          <title>Hotel Not Found | Haven & Hills</title>
          <meta name="description" content="The requested hotel property could not be found." />
        </Helmet>
        <div className="not-found-card">
          <h1>Hotel Listing Not Found</h1>
          <p>The hotel you are looking for may have been deleted or the link is incorrect.</p>
          <Link to="/" className="back-link">
            <ArrowLeft size={16} /> Back to Hotel Directory
          </Link>
        </div>
      </main>
    );
  }
  const priceFormatted = Number(hotel.price).toLocaleString("en-IN");
  const defaultAmenities = [
    "High-speed Wi-Fi",
    "Complimentary Breakfast",
    "Outdoor Swimming Pool",
    "Spa & Wellness Center",
    "24/7 Concierge & Security",
    "Valet Parking",
  ];
  const amenitiesList = hotel.amenities && hotel.amenities.length > 0 ? hotel.amenities : defaultAmenities;
  const schemaOrgData = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": hotel.title,
    "description": hotel.description,
    "image": [hotel.image],
    "priceRange": `₹${hotel.price}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": hotel.city || "India",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": Number(hotel.latitude),
      "longitude": Number(hotel.longitude)
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": hotel.rating || 4.8,
      "reviewCount": hotel.reviews || 120
    }
  };
  return (
    <>
      <Helmet>
        <title>{`${hotel.title} - ₹${priceFormatted}/night | Haven & Hills`}</title>
        <meta
          name="description"
          content={`${hotel.title}: ${hotel.description.slice(0, 150)}... Book luxury rooms at ₹${priceFormatted} per night.`}
        />
        <meta name="keywords" content={`${hotel.title}, luxury stays, hotel booking, hotel at ${hotel.latitude} ${hotel.longitude}`} />
        <meta property="og:title" content={`${hotel.title} | Haven & Hills`} />
        <meta property="og:description" content={hotel.description} />
        <meta property="og:image" content={hotel.image} />
        <meta property="og:type" content="place" />
        <meta property="og:url" content={typeof window !== "undefined" ? window.location.href : ""} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={hotel.title} />
        <meta name="twitter:description" content={hotel.description} />
        <meta name="twitter:image" content={hotel.image} />
        <meta name="geo.position" content={`${hotel.latitude};${hotel.longitude}`} />
        <meta name="ICBM" content={`${hotel.latitude}, ${hotel.longitude}`} />
        <script type="application/ld+json">
          {JSON.stringify(schemaOrgData)}
        </script>
      </Helmet>
      <main className="details-container">
        <nav className="details-breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} /> Back to All Hotels
          </Link>
          <div className="crumb-trail">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Hotels</span>
            <span>/</span>
            <strong className="current-crumb">{hotel.title}</strong>
          </div>
        </nav>
        <div className="details-hero">
          <HotelImageSlider hotel={hotel} />
        </div>
        <div className="details-grid-layout">
          <section className="details-main-info">
            <div className="details-heading-block">
              <span className="section-eyebrow">HANDPICKED DESTINATION</span>
              <h1 className="details-title">{hotel.title}</h1>
              <div className="details-location-tag">
                <MapPin size={16} />
                <span>
                  Coordinates: <strong>{Number(hotel.latitude).toFixed(4)}° N, {Number(hotel.longitude).toFixed(4)}° E</strong>
                  {hotel.city ? ` · ${hotel.city}` : ""}
                </span>
              </div>
            </div>
            <article className="details-description-card">
              <h2>About this property</h2>
              <p className="details-description-text">{hotel.description}</p>
            </article>
            <section className="property-spaces-section">
              <h2>Room Interiors & Property Spaces</h2>
              <div className="property-spaces-grid">
                <div className="space-feature-card">
                  <div className="space-feature-header">
                    <span className="space-icon-box">
                      <Bed size={18} />
                    </span>
                    <div>
                      <h3>Room Inner Living</h3>
                      <small>Master Suites & Ensuite Baths</small>
                    </div>
                  </div>
                  <p>
                    Spacious interior layout featuring plush king-size bedding, designer vanity, Egyptian cotton sheets, and quiet climate control.
                  </p>
                </div>
                <div className="space-feature-card">
                  <div className="space-feature-header">
                    <span className="space-icon-box">
                      <Trees size={18} />
                    </span>
                    <div>
                      <h3>Outer Facilities</h3>
                      <small>Pool, Garden & Outdoor Patio</small>
                    </div>
                  </div>
                  <p>
                    Heated swimming pool with submerged sun loungers, private cabanas, evening illuminated dining patio, and manicured lawns.
                  </p>
                </div>
                <div className="space-feature-card">
                  <div className="space-feature-header">
                    <span className="space-icon-box">
                      <Compass size={18} />
                    </span>
                    <div>
                      <h3>Scenic Horizon & Views</h3>
                      <small>Balcony & Panoramic Vistas</small>
                    </div>
                  </div>
                  <p>
                    Unobstructed panoramic landscape vistas, golden hour sunset horizon from private terraces, and picturesque grounds.
                  </p>
                </div>
              </div>
            </section>
            <section className="amenities-section">
              <h2>Featured Amenities & Experiences</h2>
              <div className="amenities-grid">
                {amenitiesList.map((item, idx) => (
                  <div key={idx} className="amenity-card">
                    <Check size={16} className="amenity-check-icon" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="map-embed-section" aria-label="Hotel Location & Geolocation Map">
              <HotelMap hotel={hotel} />
            </section>
          </section>

          <aside className="details-sidebar">
            <div className="booking-card">
              <div className="booking-price-header">
                <div>
                  <span className="booking-price-prefix">Estimated Total</span>
                  <div className="booking-price-amount">
                    <strong>₹{estimatedTotalPrice.toLocaleString("en-IN")}</strong>
                    <span className="booking-price-suffix">
                      / {nights} night{nights > 1 ? "s" : ""}
                    </span>
                  </div>
                  <small style={{ color: "#4b6256", fontSize: "11px", fontWeight: 600, display: "block", marginTop: "2px" }}>
                    ₹{baseRatePerNight.toLocaleString("en-IN")}/night · {roomsCount} room{roomsCount > 1 ? "s" : ""}
                  </small>
                </div>
                <div className="booking-badge">Best Rate Guaranteed</div>
              </div>

              {/* Booking Search Form */}
              <form className="booking-form" onSubmit={handleSidebarReserve}>
                {/* Dates Box */}
                <div className="booking-dates-box">
                  <div className="booking-date-field">
                    <label htmlFor="card-checkin-date">CHECK-IN</label>
                    <input
                      id="card-checkin-date"
                      type="date"
                      className="booking-date-input"
                      min={minCheckIn}
                      value={checkIn}
                      onChange={handleCheckInChange}
                      required
                    />
                  </div>

                  <div className="booking-date-field">
                    <label htmlFor="card-checkout-date">CHECK-OUT</label>
                    <input
                      id="card-checkout-date"
                      type="date"
                      className="booking-date-input"
                      min={getMinCheckOut(checkIn)}
                      value={checkOut}
                      onChange={handleCheckOutChange}
                      required
                    />
                  </div>
                </div>

                {dateError && (
                  <div className="booking-date-error" role="alert">
                    <AlertCircle size={14} />
                    <span>{dateError}</span>
                  </div>
                )}

                {/* Duration Badge */}
                <div className="booking-duration-badge">
                  <CalendarDays size={14} />
                  <span>
                    {nights} Night{nights > 1 ? "s" : ""} Duration (Taxes &amp; Breakfast Incl.)
                  </span>
                </div>

                {/* Guests & Rooms Selectors */}
                <div className="booking-select-grid">
                  <div className="booking-select-group">
                    <label htmlFor="card-adults-select">ADULTS</label>
                    <select
                      id="card-adults-select"
                      className="booking-select"
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} Adult{num > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="booking-select-group">
                    <label htmlFor="card-children-select">CHILDREN</label>
                    <select
                      id="card-children-select"
                      className="booking-select"
                      value={children}
                      onChange={(e) => setChildren(Number(e.target.value))}
                    >
                      {[0, 1, 2, 3, 4].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Child" : "Children"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="booking-select-group">
                    <label htmlFor="card-rooms-select">ROOMS</label>
                    <select
                      id="card-rooms-select"
                      className="booking-select"
                      value={roomsCount}
                      onChange={(e) => setRoomsCount(Number(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num} Room{num > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="booking-select-group">
                    <label htmlFor="card-roomtype-select">ROOM TYPE</label>
                    <select
                      id="card-roomtype-select"
                      className="booking-select"
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                    >
                      <option value="all">All Room Types</option>
                      <option value="standard">Standard Room</option>
                      <option value="deluxe">Deluxe Room</option>
                      <option value="suite">Premium Suite</option>
                    </select>
                  </div>
                </div>

                {/* Estimate Box */}
                <div className="booking-estimate-box">
                  <div className="booking-estimate-label">
                    <small>ESTIMATED TOTAL</small>
                    <span>
                      {nights}N × {roomsCount} room{roomsCount > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="booking-estimate-total">
                    <strong>₹{estimatedTotalPrice.toLocaleString("en-IN")}</strong>
                  </div>
                </div>

                {/* Buttons */}
                <button
                  type="submit"
                  className="btn-reserve"
                >
                  <CalendarCheck size={16} /> Reserve Room
                </button>
              </form>

              {bookingSuccessAlert && (
                <div className="booking-confirmed-alert" role="status">
                  <Check size={16} /> Demo booking {bookingSuccessAlert.bookingReference} saved!
                </div>
              )}

              <div className="booking-guarantee-list">
                <div className="guarantee-item">
                  <ShieldCheck size={15} />
                  <span>Free cancellation up to 48 hours prior</span>
                </div>
                <div className="guarantee-item">
                  <Coffee size={15} />
                  <span>Complimentary artisan breakfast included</span>
                </div>
                <div className="guarantee-item">
                  <Wifi size={15} />
                  <span>High-speed Wi-Fi throughout resort</span>
                </div>
              </div>

              <button
                type="button"
                className="btn-share-stay"
                onClick={handleShare}
              >
                <Share2 size={14} />
                {copiedNotice ? "Link copied to clipboard!" : "Share this stay"}
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* Reservation Confirmation & Success Modal */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        hotel={hotel}
        room={selectedRoomForModal}
        onBookingSuccess={handleBookingSuccess}
      />
    </>
  );
}