import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  MapPin,
  Star,
  ShieldCheck,
  Coffee,
  Wifi,
  Sparkles,
  Share2,
  CalendarCheck,
  Check,
} from "lucide-react";
import { getImageUrl } from "../services/hotelApi";

import HotelMap from "../components/HotelMap";
import "./HotelDetails.css";

export default function HotelDetails() {
  const { id } = useParams();
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [bookingBooked, setBookingBooked] = useState(false);

  const hotel = useSelector((state) =>
    state.hotels.hotels.find((item) => String(item.id) === String(id))
  );

  function handleShare() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedNotice(true);
      setTimeout(() => setCopiedNotice(false), 3000);
    }
  }

  function handleBook() {
    setBookingBooked(true);
    setTimeout(() => setBookingBooked(false), 4000);
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
          <div className="details-image-wrapper">
            <img
              src={getImageUrl(hotel.image)}
              alt={`${hotel.title} - Full exterior and guest facilities preview`}
              className="details-image"
              loading="eager"
            />
            <div className="details-image-overlay" />
            <div className="details-image-badges">
              <span className="badge-luxury">
                <Sparkles size={12} /> LUXURY COLLECTION
              </span>
              {hotel.rating && (
                <span className="badge-rating">
                  <Star size={13} fill="#ffb400" color="#ffb400" />
                  {hotel.rating} ({hotel.reviews || 120} verified reviews)
                </span>
              )}
            </div>
          </div>
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
                  <span className="booking-price-prefix">Price per night</span>
                  <div className="booking-price-amount">
                    <strong>₹{priceFormatted}</strong>
                    <span className="booking-price-suffix">/ room</span>
                  </div>
                </div>
                <div className="booking-badge">Best Rate Guaranteed</div>
              </div>

              <div className="booking-dates-box">
                <div className="booking-date-field">
                  <small>CHECK-IN</small>
                  <span>Today</span>
                </div>
                <div className="booking-date-field">
                  <small>CHECK-OUT</small>
                  <span>Tomorrow</span>
                </div>
              </div>

              <div className="booking-guests-field">
                <small>GUESTS</small>
                <span>2 Adults · 1 Deluxe Room</span>
              </div>

              <button
                type="button"
                className="btn-reserve"
                onClick={handleBook}
              >
                <CalendarCheck size={16} />
                Reserve Room
              </button>

              {bookingBooked && (
                <div className="booking-confirmed-alert" role="status">
                  <Check size={16} /> Reservation simulated successfully!
                </div>
              )}

              <div className="booking-guarantee-list">
                <div className="guarantee-item">
                  <ShieldCheck size={15} />
                  <span>Free cancellation up to 48 hours prior</span>
                </div>
                <div className="guarantee-item">
                  <Coffee size={15} />
                  <span>Complimentary breakfast included</span>
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
    </>
  );
}
