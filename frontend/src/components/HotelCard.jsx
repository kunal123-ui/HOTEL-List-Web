import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Pencil, Trash2, ArrowUpRight, Star } from "lucide-react";
import { getImageUrl, DEFAULT_HOTEL_IMAGE } from "../services/hotelApi";
import "./HotelCard.css";

export default function HotelCard({ hotel, onEdit, onDelete, viewMode = "list" }) {
  const priceFormatted = Number(hotel.price).toLocaleString("en-IN");
  const latFormatted = Number(hotel.latitude).toFixed(4);
  const lngFormatted = Number(hotel.longitude).toFixed(4);
  const resolvedImage = getImageUrl(hotel.image);
  const [hasImageError, setHasImageError] = useState(false);
  const imageSource = hasImageError ? DEFAULT_HOTEL_IMAGE : (resolvedImage || DEFAULT_HOTEL_IMAGE);

  return (
    <article className={`hotel-card ${viewMode}-card`} id={`hotel-card-${hotel.id}`}>
      <Link
        to={`/hotels/${hotel.id}`}
        className="hotel-image-link"
        aria-label={`View details for ${hotel.title}`}
      >
        <img
          src={imageSource}
          alt={`${hotel.title} - Luxury hotel property`}
          className="hotel-image"
          loading="lazy"
          onError={() => setHasImageError(true)}
        />
        <div className="card-image-gradient" />
        {hotel.rating && (
          <div className="card-rating-badge">
            <Star size={12} fill="#ffb400" color="#ffb400" />
            <span>{hotel.rating}</span>
          </div>
        )}
      </Link>

      <div className="hotel-card-content">
        <div className="hotel-card-main">
          <div className="card-top-meta">
            <span className="hotel-label">FEATURED STAY</span>
            {hotel.city && <span className="hotel-city-tag">{hotel.city}</span>}
          </div>

          <h3 className="hotel-card-title">
            <Link to={`/hotels/${hotel.id}`}>{hotel.title}</Link>
          </h3>

          <p className="hotel-description" title={hotel.description}>
            {hotel.description}
          </p>

          <div className="hotel-card-footer-meta">
            <div className="hotel-location" title={`Coordinates: ${hotel.latitude}, ${hotel.longitude}`}>
              <MapPin size={14} />
              <span>{latFormatted}°, {lngFormatted}°</span>
            </div>

            {hotel.amenities && hotel.amenities.length > 0 && (
              <div className="card-amenity-pills">
                {hotel.amenities.slice(0, 2).map((amenity, i) => (
                  <span key={i} className="amenity-pill">{amenity}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="hotel-card-side">
          <div className="price-block">
            <span className="price-caption">Starting from</span>
            <strong className="hotel-price">₹{priceFormatted}</strong>
            <span className="price-night">per night (taxes incl.)</span>
          </div>

          <Link
            to={`/hotels/${hotel.id}`}
            className="details-button"
            aria-label={`Explore ${hotel.title} details and location map`}
          >
            View Details <ArrowUpRight size={15} />
          </Link>

          <div className="hotel-actions">
            <button
              type="button"
              className="edit-button"
              onClick={() => onEdit(hotel)}
              aria-label={`Edit ${hotel.title}`}
              title="Edit hotel details"
            >
              <Pencil size={14} />
              <span>Edit</span>
            </button>

            <button
              type="button"
              className="delete-button"
              onClick={() => onDelete(hotel)}
              aria-label={`Delete ${hotel.title}`}
              title="Delete hotel listing"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
