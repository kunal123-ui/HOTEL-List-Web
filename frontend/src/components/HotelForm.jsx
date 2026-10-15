import { useEffect, useState, useRef } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  LocateFixed,
  Sparkles,
  AlertCircle,
  Check,
  RotateCcw,
} from "lucide-react";
import { getImageUrl } from "../services/hotelApi";
import "./HotelForm.css";

const SAMPLE_IMAGES = [
  {
    name: "Luxury Villa & Pool",
    url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000&auto=format&fit=crop&q=80",
  },
  {
    name: "Coastal Beach Resort",
    url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1000&auto=format&fit=crop&q=80",
  },
  {
    name: "Mountain Pine Haven",
    url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1000&auto=format&fit=crop&q=80",
  },
  {
    name: "Boutique Heritage Palace",
    url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1000&auto=format&fit=crop&q=80",
  },
];

const PRESET_COORDS = [
  { name: "Goa Beach", lat: 15.2993, lng: 74.124 },
  { name: "Mumbai Marine", lat: 18.922, lng: 72.8347 },
  { name: "Jaipur Palace", lat: 26.9124, lng: 75.7873 },
  { name: "Bengaluru City", lat: 12.9716, lng: 77.5946 },
  { name: "Ooty Hills", lat: 11.4102, lng: 76.695 },
];

const emptyForm = {
  title: "",
  description: "",
  latitude: "",
  longitude: "",
  price: "",
  image: "",
};

export default function HotelForm({ hotel, onSave, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [imageTab, setImageTab] = useState("upload");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [geoLocating, setGeoLocating] = useState(false);
  const [geoNotice, setGeoNotice] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (hotel) {
      setForm({
        title: hotel.title || "",
        description: hotel.description || "",
        latitude: hotel.latitude ?? "",
        longitude: hotel.longitude ?? "",
        price: hotel.price ?? "",
        image: hotel.image || "",
      });
      setPreview(hotel.image ? getImageUrl(hotel.image) : "");
      setImageUrlInput(hotel.image || "");
    } else {
      setForm(emptyForm);
      setPreview("");
      setImageUrlInput("");
    }
    setErrors({});
    setTouched({});
    setGeoNotice("");
  }, [hotel]);

  function validate(fields = form) {
    const newErrors = {};

    if (!fields.title.trim()) {
      newErrors.title = "Hotel name is required.";
    } else if (fields.title.trim().length < 3) {
      newErrors.title = "Hotel name must be at least 3 characters.";
    } else if (fields.title.trim().length > 120) {
      newErrors.title = "Hotel name must not exceed 120 characters.";
    }

    if (!fields.description.trim()) {
      newErrors.description = "Hotel description is required.";
    } else if (fields.description.trim().length < 15) {
      newErrors.description = "Please provide a meaningful description (at least 15 characters).";
    }

    if (fields.latitude === "" || fields.latitude === null || fields.latitude === undefined) {
      newErrors.latitude = "Latitude is required.";
    } else {
      const lat = Number(fields.latitude);
      if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
        newErrors.latitude = "Latitude must be a valid number between -90 and 90.";
      }
    }

    if (fields.longitude === "" || fields.longitude === null || fields.longitude === undefined) {
      newErrors.longitude = "Longitude is required.";
    } else {
      const lng = Number(fields.longitude);
      if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
        newErrors.longitude = "Longitude must be a valid number between -180 and 180.";
      }
    }

    if (fields.price === "" || fields.price === null || fields.price === undefined) {
      newErrors.price = "Price per night is required.";
    } else {
      const pr = Number(fields.price);
      if (!Number.isFinite(pr) || pr <= 0) {
        newErrors.price = "Price must be a positive number greater than 0.";
      }
    }

    if (!preview && !fields.image) {
      newErrors.image = "Please upload an image, enter an image URL, or pick a sample photo.";
    }

    return newErrors;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    let finalValue = value;
    if (name === "price") {
      finalValue = value.replace(/[^0-9]/g, "");
    }
    const nextForm = { ...form, [name]: finalValue };
    setForm(nextForm);

    if (touched[name]) {
      const fieldErrors = validate(nextForm);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldErrors[name],
      }));
    }
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validate(form);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldErrors[name],
    }));
  }

  function handleImageFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Please choose a valid image file (PNG, JPG, WebP)." }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image size must be 5 MB or less." }));
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setPreview(dataUrl);
      setForm((prev) => ({ ...prev, image: dataUrl }));
      setErrors((prev) => ({ ...prev, image: undefined }));
    };
    reader.readAsDataURL(file);
  }

  function applyImageUrl() {
    if (!imageUrlInput.trim()) {
      setErrors((prev) => ({ ...prev, image: "Enter a valid image URL." }));
      return;
    }
    setImageFile(null);
    setPreview(imageUrlInput.trim());
    setForm((prev) => ({ ...prev, image: imageUrlInput.trim() }));
    setErrors((prev) => ({ ...prev, image: undefined }));
  }

  function selectSampleImage(url) {
    setImageFile(null);
    setPreview(url);
    setImageUrlInput(url);
    setForm((prev) => ({ ...prev, image: url }));
    setErrors((prev) => ({ ...prev, image: undefined }));
  }

  function clearImage() {
    setImageFile(null);
    setPreview("");
    setImageUrlInput("");
    setForm((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function useCurrentGeolocation() {
    if (!navigator.geolocation) {
      setGeoNotice("Geolocation API is not supported in this browser.");
      return;
    }

    setGeoLocating(true);
    setGeoNotice("Detecting your location coordinates...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setForm((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
        setErrors((prev) => ({
          ...prev,
          latitude: undefined,
          longitude: undefined,
        }));
        setGeoLocating(false);
        setGeoNotice(`Auto-filled coordinates: [${lat}, ${lng}]`);
        setTimeout(() => setGeoNotice(""), 5000);
      },
      (err) => {
        setGeoLocating(false);
        setGeoNotice(`Geolocation error: ${err.message || "Permission denied."}`);
        setTimeout(() => setGeoNotice(""), 5000);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  function applyPresetCoords(preset) {
    setForm((prev) => ({
      ...prev,
      latitude: preset.lat,
      longitude: preset.lng,
    }));
    setErrors((prev) => ({
      ...prev,
      latitude: undefined,
      longitude: undefined,
    }));
    setGeoNotice(`Applied coordinates for ${preset.name}`);
    setTimeout(() => setGeoNotice(""), 4000);
  }

  function handleSubmit(event) {
    event.preventDefault();

    setTouched({
      title: true,
      description: true,
      latitude: true,
      longitude: true,
      price: true,
      image: true,
    });

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const finalImage = preview || form.image || SAMPLE_IMAGES[0].url;

    onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      price: Number(form.price),
      image: finalImage,
      imageFile: imageFile || null,
    });
  }

  return (
    <form className="hotel-form" onSubmit={handleSubmit} noValidate>
      <div className="form-header">
        <div>
          <span className="section-eyebrow">
            {hotel ? "UPDATE PROPERTY DETAILS" : "CREATE NEW LISTING"}
          </span>
          <h2>{hotel ? "Edit Hotel Details" : "Add a New Hotel"}</h2>
          <p>
            {hotel
              ? `Update details and coordinates for "${hotel.title}"`
              : "Complete the form below to publish a new hotel stay."}
          </p>
        </div>
        <button
          type="button"
          className="form-close"
          onClick={onCancel}
          aria-label="Close hotel form"
          title="Close form"
        >
          <X size={20} />
        </button>
      </div>

      <div className="form-layout">
        <div className="form-fields">
          <div className="field-group">
            <label htmlFor="hotel-title">
              Hotel Title / Name <span className="req">*</span>
            </label>
            <input
              id="hotel-title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={120}
              placeholder="e.g. The Grand Azure Retreat"
              className={errors.title && touched.title ? "input-error" : ""}
              aria-invalid={errors.title && touched.title ? "true" : "false"}
              aria-describedby={errors.title ? "title-error" : undefined}
              required
            />
            {errors.title && touched.title && (
              <span id="title-error" className="field-error-text" role="alert">
                <AlertCircle size={13} /> {errors.title}
              </span>
            )}
          </div>

          <div className="field-group">
            <div className="field-label-row">
              <label htmlFor="hotel-desc">
                Description <span className="req">*</span>
              </label>
              <span className="char-count">{form.description.length}/1500</span>
            </div>
            <textarea
              id="hotel-desc"
              name="description"
              value={form.description}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={4}
              maxLength={1500}
              placeholder="Describe the hotel atmosphere, amenities, views, and unique guest experiences..."
              className={errors.description && touched.description ? "input-error" : ""}
              aria-invalid={errors.description && touched.description ? "true" : "false"}
              aria-describedby={errors.description ? "desc-error" : undefined}
              required
            />
            {errors.description && touched.description && (
              <span id="desc-error" className="field-error-text" role="alert">
                <AlertCircle size={13} /> {errors.description}
              </span>
            )}
          </div>

          <div className="field-group">
            <label htmlFor="hotel-price">
              Price per Night (₹) <span className="req">*</span>
            </label>
            <div className="input-prefix-wrap">
              <span className="input-currency-symbol">₹</span>
              <input
                id="hotel-price"
                type="number"
                name="price"
                min="1"
                step="1"
                value={form.price}
                onKeyDown={(e) => {
                  if (["-", "+", "e", "E", "Subtract"].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onPaste={(e) => {
                  const paste = e.clipboardData?.getData("text") || "";
                  if (/[^0-9]/.test(paste)) {
                    e.preventDefault();
                    const cleaned = paste.replace(/[^0-9]/g, "");
                    if (cleaned) {
                      document.execCommand?.("insertText", false, cleaned);
                    }
                  }
                }}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="4500"
                className={errors.price && touched.price ? "input-error with-prefix" : "with-prefix"}
                aria-invalid={errors.price && touched.price ? "true" : "false"}
                aria-describedby={errors.price ? "price-error" : undefined}
                required
              />
            </div>
            {errors.price && touched.price && (
              <span id="price-error" className="field-error-text" role="alert">
                <AlertCircle size={13} /> {errors.price}
              </span>
            )}
          </div>

          <div className="field-group">
            <div className="field-label-row">
              <label>
                Coordinates (Latitude & Longitude) <span className="req">*</span>
              </label>
              <button
                type="button"
                className="btn-form-geolocation"
                onClick={useCurrentGeolocation}
                disabled={geoLocating}
                title="Fill with your device's current GPS location via Geolocation API"
              >
                <LocateFixed size={14} />
                {geoLocating ? "Detecting GPS..." : "Auto-Fill via Geolocation API"}
              </button>
            </div>

            <div className="form-row">
              <div className="subfield">
                <label htmlFor="hotel-lat">Latitude (-90 to 90)</label>
                <input
                  id="hotel-lat"
                  type="number"
                  name="latitude"
                  value={form.latitude}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min="-90"
                  max="90"
                  step="any"
                  placeholder="13.0827"
                  className={errors.latitude && touched.latitude ? "input-error" : ""}
                  aria-invalid={errors.latitude && touched.latitude ? "true" : "false"}
                  required
                />
                {errors.latitude && touched.latitude && (
                  <span className="field-error-text" role="alert">
                    <AlertCircle size={13} /> {errors.latitude}
                  </span>
                )}
              </div>

              <div className="subfield">
                <label htmlFor="hotel-lng">Longitude (-180 to 180)</label>
                <input
                  id="hotel-lng"
                  type="number"
                  name="longitude"
                  value={form.longitude}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min="-180"
                  max="180"
                  step="any"
                  placeholder="80.2707"
                  className={errors.longitude && touched.longitude ? "input-error" : ""}
                  aria-invalid={errors.longitude && touched.longitude ? "true" : "false"}
                  required
                />
                {errors.longitude && touched.longitude && (
                  <span className="field-error-text" role="alert">
                    <AlertCircle size={13} /> {errors.longitude}
                  </span>
                )}
              </div>
            </div>

            <div className="preset-coords-wrap">
              <span className="preset-coords-label">Quick Presets:</span>
              <div className="preset-chips">
                {PRESET_COORDS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    className="preset-chip"
                    onClick={() => applyPresetCoords(p)}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {geoNotice && (
              <p className="geo-notice-msg" role="status">
                <Check size={14} /> {geoNotice}
              </p>
            )}
          </div>
        </div>

        <div className="form-upload-column">
          <div className="upload-header-row">
            <span className="upload-label">
              Hotel Image <span className="req">*</span>
            </span>
            <div className="image-mode-tabs">
              <button
                type="button"
                className={`tab-btn ${imageTab === "upload" ? "active" : ""}`}
                onClick={() => setImageTab("upload")}
              >
                Upload File
              </button>
              <button
                type="button"
                className={`tab-btn ${imageTab === "url" ? "active" : ""}`}
                onClick={() => setImageTab("url")}
              >
                URL
              </button>
              <button
                type="button"
                className={`tab-btn ${imageTab === "presets" ? "active" : ""}`}
                onClick={() => setImageTab("presets")}
              >
                Samples
              </button>
            </div>
          </div>

          {imageTab === "upload" && (
            <label className="upload-area">
              {preview ? (
                <div className="preview-container">
                  <img src={preview} alt="Hotel preview" className="preview-image" />
                  <button
                    type="button"
                    className="btn-remove-preview"
                    onClick={(e) => {
                      e.preventDefault();
                      clearImage();
                    }}
                    title="Remove preview"
                  >
                    <RotateCcw size={14} /> Clear
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-icon-circle">
                    <ImageIcon size={32} />
                  </div>
                  <strong>Upload Hotel Photo</strong>
                  <small>Supports PNG, JPG, WebP (up to 5 MB)</small>
                  <span className="btn-browse-file">
                    <Upload size={14} /> Browse from Device
                  </span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFile}
              />
            </label>
          )}

          {imageTab === "url" && (
            <div className="url-mode-box">
              <div className="url-input-row">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                />
                <button
                  type="button"
                  className="btn-apply-url"
                  onClick={applyImageUrl}
                >
                  Apply
                </button>
              </div>

              {preview ? (
                <div className="preview-container small-preview">
                  <img src={preview} alt="Hotel preview from URL" className="preview-image" />
                  <button
                    type="button"
                    className="btn-remove-preview"
                    onClick={clearImage}
                  >
                    <RotateCcw size={14} /> Clear
                  </button>
                </div>
              ) : (
                <div className="url-preview-empty">
                  <small>Enter a direct image link and click Apply to preview.</small>
                </div>
              )}
            </div>
          )}

          {imageTab === "presets" && (
            <div className="sample-images-grid">
              {SAMPLE_IMAGES.map((sample) => (
                <button
                  type="button"
                  key={sample.name}
                  className={`sample-thumb-btn ${preview === sample.url ? "selected" : ""}`}
                  onClick={() => selectSampleImage(sample.url)}
                >
                  <img src={sample.url} alt={sample.name} />
                  <span>
                    <Sparkles size={11} /> {sample.name}
                  </span>
                </button>
              ))}
            </div>
          )}

          {errors.image && (
            <span className="field-error-text upload-error" role="alert">
              <AlertCircle size={14} /> {errors.image}
            </span>
          )}

          <div className="image-help-text">
            <span>✓ High-resolution photo recommended</span>
            <span>✓ Live preview updates immediately</span>
          </div>
        </div>
      </div>

      <div className="form-actions-bar">
        <button type="submit" className="primary-button submit-btn">
          {hotel ? "Save Changes" : "Add Hotel Property"}
        </button>
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
