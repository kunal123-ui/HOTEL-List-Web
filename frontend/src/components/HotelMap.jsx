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
  Car
} from "lucide-react";
import { getImageUrl } from "../services/hotelApi";
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
  const tileLayerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const routeLineRef = useRef(null);

  const [mapSource, setMapSource] = useState("osm");
  const [userCoords, setUserCoords] = useState(null);
  const [distance, setDistance] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hotelLat = Number(hotel?.latitude);
  const hotelLng = Number(hotel?.longitude);
  const isValidCoords = !isNaN(hotelLat) && !isNaN(hotelLng);

  useEffect(() => {
    if (!mapContainerRef.current || !isValidCoords) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [hotelLat, hotelLng],
      zoom: 14,
      scrollWheelZoom: false
    });

    const tileUrl =
      mapSource === "google"
        ? "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

    const tileAttr =
      mapSource === "google"
        ? "&copy; Google Maps"
        : "&copy; OpenStreetMap contributors";

    const tileLayer = L.tileLayer(tileUrl, {
      attribution: tileAttr,
      maxZoom: 20
    }).addTo(map);

    tileLayerRef.current = tileLayer;

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
      popupAnchor: [0, -40]
    });

    const popupContent = `
      <div class="leaflet-hotel-popup">
        <img src="${getImageUrl(hotel.image)}" alt="${hotel.title}" class="popup-thumb" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop&q=80'" />
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
  }, [hotelLat, hotelLng, hotel.title, hotel.image, hotel.price, isValidCoords, mapSource]);

  useEffect(() => {
    if (!tileLayerRef.current) return;
    const tileUrl =
      mapSource === "google"
        ? "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    tileLayerRef.current.setUrl(tileUrl);
  }, [mapSource]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const uLat = position.coords.latitude;
        const uLng = position.coords.longitude;
        const acc = Math.round(position.coords.accuracy);
        const dist = calculateDistance(uLat, uLng, hotelLat, hotelLng);

        setUserCoords({ latitude: uLat, longitude: uLng });
        setDistance(dist);
        setAccuracy(acc);
        setLoading(false);

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
            iconAnchor: [14, 14]
          });

          userMarkerRef.current = L.marker([uLat, uLng], { icon: userIcon })
            .addTo(map)
            .bindPopup(
              `<div class="leaflet-user-popup"><strong>Your Location</strong><br><small>Accuracy: ±${acc}m</small></div>`
            );

          routeLineRef.current = L.polyline(
            [
              [uLat, uLng],
              [hotelLat, hotelLng]
            ],
            {
              color: "#183d33",
              weight: 3,
              opacity: 0.75,
              dashArray: "6, 8"
            }
          ).addTo(map);

          const bounds = L.latLngBounds([
            [uLat, uLng],
            [hotelLat, hotelLng]
          ]);
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }
      },
      (err) => {
        setLoading(false);
        if (err.code === 1) {
          setError("Location permission denied. Please allow location access.");
        } else {
          setError("Unable to find your current location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const directionsUrl = userCoords
    ? `https://www.google.com/maps/dir/?api=1&origin=${userCoords.latitude},${userCoords.longitude}&destination=${hotelLat},${hotelLng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${hotelLat},${hotelLng}`;

  return (
    <div className="hotel-map-card">
      <div className="hotel-map-header">
        <div>
          <span className="map-badge">
            <Compass size={14} />
            LOCATION MAP
          </span>
          <h3>Location & Distance</h3>
          <p className="map-coords-text">
            Coordinates: <strong>{hotelLat.toFixed(4)}° N, {hotelLng.toFixed(4)}° E</strong>
          </p>
        </div>

        <div className="map-quick-links">
          <button
            type="button"
            className={`external-map-link ${mapSource === "google" ? "active" : ""}`}
            onClick={() => setMapSource("google")}
          >
            Google Maps
          </button>
          <button
            type="button"
            className={`external-map-link ${mapSource === "osm" ? "active" : ""}`}
            onClick={() => setMapSource("osm")}
          >
            OSM
          </button>
        </div>
      </div>

      <div className="geolocation-api-box">
        <div className="geo-action-header">
          <div className="geo-title-wrap">
            <LocateFixed size={18} className="geo-icon" />
            <div>
              <strong>Live Distance Finder</strong>
              <small>Calculate distance from your current position to this hotel</small>
            </div>
          </div>

          <button
            type="button"
            className={`btn-locate ${loading ? "loading" : ""}`}
            onClick={handleGetLocation}
            disabled={loading}
          >
            <Navigation size={14} />
            {loading ? "Getting location..." : userCoords ? "Recalculate Distance" : "Get Distance"}
          </button>
        </div>

        {userCoords && distance !== null && (
          <div className="geo-results-banner">
            <div className="geo-distance-stat">
              <CheckCircle size={22} className="geo-success-icon" />
              <div>
                <span className="distance-label">Distance from your position:</span>
                <span className="distance-value">
                  {distance < 1
                    ? `${Math.round(distance * 1000)} meters`
                    : `${distance.toFixed(1)} km`}
                </span>
                {accuracy && (
                  <span className="distance-accuracy">
                    (Accuracy: ±{accuracy}m)
                  </span>
                )}
              </div>
            </div>

            <div className="geo-user-coords">
              <span>Your Lat: {userCoords.latitude.toFixed(4)}°</span>
              <span>Your Lng: {userCoords.longitude.toFixed(4)}°</span>
            </div>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-directions"
            >
              <Car size={15} />
              Get Directions
              <ExternalLink size={13} />
            </a>
          </div>
        )}

        {error && (
          <div className="geo-error-banner">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="leaflet-map-wrapper">
        <div ref={mapContainerRef} className="leaflet-map-view" />
      </div>

      <div className="map-footer-caption">
        <MapPin size={15} />
        <span>
          Showing location for <strong>{hotel.title}</strong> [{hotelLat}, {hotelLng}] using {mapSource === "google" ? "Google Maps" : "OpenStreetMap"}.
        </span>
      </div>
    </div>
  );
}
