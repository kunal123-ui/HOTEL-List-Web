import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPin,
  Navigation,
  Compass,
  ExternalLink,
  LocateFixed,
  AlertCircle,
  CheckCircle,
  Car,
} from "lucide-react";
import "./HotelMap.css";

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function HotelMap({ hotel }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const routeLineRef = useRef(null);

  const [geoState, setGeoState] = useState({
    status: "idle",
    userCoords: null,
    distanceKm: null,
    accuracy: null,
    errorMessage: "",
  });

  const hotelLat = Number(hotel.latitude);
  const hotelLng = Number(hotel.longitude);
  const isValidCoords =
    Number.isFinite(hotelLat) &&
    Number.isFinite(hotelLng) &&
    hotelLat >= -90 &&
    hotelLat <= 90 &&
    hotelLng >= -180 &&
    hotelLng <= 180;

  useEffect(() => {
    if (!mapContainerRef.current || !isValidCoords) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [hotelLat, hotelLng],
      zoom: 14,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const hotelIcon = L.divIcon({
      className: "custom-leaflet-marker hotel-marker",
      html: `
        <div class="marker-pin hotel-pin">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      `,
      iconSize: [36, 44],
      iconAnchor: [18, 42],
      popupAnchor: [0, -40],
    });

    const popupContent = `
      <div class="leaflet-hotel-popup">
        <img src="${hotel.image}" alt="${hotel.title}" class="popup-thumb" />
        <div class="popup-body">
          <strong class="popup-title">${hotel.title}</strong>
          <span class="popup-price">₹${Number(hotel.price).toLocaleString("en-IN")} / night</span>
          <span class="popup-coords">${hotelLat.toFixed(4)}, ${hotelLng.toFixed(4)}</span>
        </div>
      </div>
    `;

    L.marker([hotelLat, hotelLng], { icon: hotelIcon })
      .addTo(map)
      .bindPopup(popupContent)
      .openPopup();

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [hotelLat, hotelLng, hotel.title, hotel.image, hotel.price, isValidCoords]);

  function requestUserLocation() {
    if (!navigator.geolocation) {
      setGeoState({
        status: "unsupported",
        userCoords: null,
        distanceKm: null,
        accuracy: null,
        errorMessage: "Geolocation API is not supported by your browser.",
      });
      return;
    }

    setGeoState((prev) => ({
      ...prev,
      status: "loading",
      errorMessage: "",
    }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const uLat = position.coords.latitude;
        const uLng = position.coords.longitude;
        const acc = Math.round(position.coords.accuracy);
        const distance = calculateDistance(uLat, uLng, hotelLat, hotelLng);

        setGeoState({
          status: "success",
          userCoords: { latitude: uLat, longitude: uLng },
          distanceKm: distance,
          accuracy: acc,
          errorMessage: "",
        });

        const map = mapInstanceRef.current;
        if (map) {
          if (userMarkerRef.current) {
            map.removeLayer(userMarkerRef.current);
          }
          if (routeLineRef.current) {
            map.removeLayer(routeLineRef.current);
          }

          const userIcon = L.divIcon({
            className: "custom-leaflet-marker user-marker",
            html: `
              <div class="marker-user-container">
                <span class="pulse-ring"></span>
                <span class="user-dot"></span>
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });

          userMarkerRef.current = L.marker([uLat, uLng], { icon: userIcon })
            .addTo(map)
            .bindPopup(
              `<div class="leaflet-user-popup"><strong>Your Current Location</strong><br><small>Accuracy: ±${acc}m</small></div>`
            );

          routeLineRef.current = L.polyline(
            [
              [uLat, uLng],
              [hotelLat, hotelLng],
            ],
            {
              color: "#183d33",
              weight: 3,
              opacity: 0.75,
              dashArray: "6, 8",
            }
          ).addTo(map);

          const bounds = L.latLngBounds([
            [uLat, uLng],
            [hotelLat, hotelLng],
          ]);
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }
      },
      (error) => {
        let msg = "Unable to retrieve your location.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Geolocation permission was denied. Please allow location access in your browser settings.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = "Location information is unavailable.";
        } else if (error.code === error.TIMEOUT) {
          msg = "The request to get user location timed out.";
        }
        setGeoState({
          status: "error",
          userCoords: null,
          distanceKm: null,
          accuracy: null,
          errorMessage: msg,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }

  const directionsUrl = geoState.userCoords
    ? `https://www.google.com/maps/dir/?api=1&origin=${geoState.userCoords.latitude},${geoState.userCoords.longitude}&destination=${hotelLat},${hotelLng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${hotelLat},${hotelLng}`;

  const openStreetUrl = `https://www.openstreetmap.org/?mlat=${hotelLat}&mlon=${hotelLng}#map=15/${hotelLat}/${hotelLng}`;

  return (
    <div className="hotel-map-card">
      <div className="hotel-map-header">
        <div>
          <span className="map-badge">
            <Compass size={14} />
            INTERACTIVE GEOLOCATION MAP
          </span>
          <h3>Location & Distance</h3>
          <p className="map-coords-text">
            Coordinates: <strong>{hotelLat.toFixed(4)}° N, {hotelLng.toFixed(4)}° E</strong>
          </p>
        </div>

        <div className="map-quick-links">
          <a
            href={`https://www.google.com/maps?q=${hotelLat},${hotelLng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="external-map-link"
          >
            Google Maps <ExternalLink size={13} />
          </a>
          <a
            href={openStreetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="external-map-link"
          >
            OSM <ExternalLink size={13} />
          </a>
        </div>
      </div>

      <div className="geolocation-api-box">
        <div className="geo-action-header">
          <div className="geo-title-wrap">
            <LocateFixed size={18} className="geo-icon" />
            <div>
              <strong>Browser Geolocation API Integration</strong>
              <small>Detect your live coordinates and measure exact distance to this stay</small>
            </div>
          </div>

          <button
            type="button"
            className={`btn-locate ${geoState.status === "loading" ? "loading" : ""}`}
            onClick={requestUserLocation}
            disabled={geoState.status === "loading"}
          >
            <Navigation size={14} />
            {geoState.status === "loading"
              ? "Accessing Geolocation..."
              : geoState.status === "success"
              ? "Re-calculate Distance"
              : "Locate Me via Geolocation API"}
          </button>
        </div>

        {geoState.status === "success" && geoState.userCoords && (
          <div className="geo-results-banner">
            <div className="geo-distance-stat">
              <CheckCircle size={22} className="geo-success-icon" />
              <div>
                <span className="distance-label">Distance from your position:</span>
                <span className="distance-value">
                  {geoState.distanceKm < 1
                    ? `${Math.round(geoState.distanceKm * 1000)} meters`
                    : `${geoState.distanceKm.toFixed(1)} km`}
                </span>
                <span className="distance-accuracy">
                  (Accurate to ±{geoState.accuracy}m · Haversine Geodesic)
                </span>
              </div>
            </div>

            <div className="geo-user-coords">
              <span>Your Lat: {geoState.userCoords.latitude.toFixed(4)}°</span>
              <span>Your Lng: {geoState.userCoords.longitude.toFixed(4)}°</span>
            </div>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-directions"
            >
              <Car size={15} />
              Open Live Turn-by-Turn Directions
              <ExternalLink size={13} />
            </a>
          </div>
        )}

        {(geoState.status === "error" || geoState.status === "unsupported") && (
          <div className="geo-error-banner">
            <AlertCircle size={18} />
            <span>{geoState.errorMessage}</span>
          </div>
        )}
      </div>

      <div className="leaflet-map-wrapper">
        <div ref={mapContainerRef} className="leaflet-map-view" />
      </div>

      <div className="map-footer-caption">
        <MapPin size={15} />
        <span>
          Showing exact pin for <strong>{hotel.title}</strong> at coordinates [{hotelLat}, {hotelLng}].
        </span>
      </div>
    </div>
  );
}
