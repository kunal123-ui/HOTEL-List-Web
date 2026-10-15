import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Sparkles,
  Star,
  Play,
  Pause,
  Bed,
  Trees,
  Compass,
  Building2,
  Images,
  Video,
} from "lucide-react";
import { getHotelGallery, CATEGORIES } from "../utils/hotelMedia";
import { DEFAULT_HOTEL_IMAGE } from "../services/hotelApi";
import "./HotelImageSlider.css";

const CATEGORY_ICONS = {
  [CATEGORIES.ALL]: Images,
  [CATEGORIES.VIDEO_TOUR]: Video,
  [CATEGORIES.ROOM_INNER]: Bed,
  [CATEGORIES.OUTER_FACILITIES]: Trees,
  [CATEGORIES.SCENIC_VIEW]: Compass,
  [CATEGORIES.EXTERIOR]: Building2,
};

export default function HotelImageSlider({ hotel }) {
  const allSlides = getHotelGallery(hotel);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES.ALL);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const thumbnailStripRef = useRef(null);

  const displayedSlides =
    selectedCategory === CATEGORIES.ALL
      ? allSlides
      : allSlides.filter((slide) => slide.category === selectedCategory);

  const totalSlides = displayedSlides.length;

  function handleCategorySelect(categoryName) {
    setSelectedCategory(categoryName);
    setCurrentIndex(0);
  }

  function handleNext() {
    if (totalSlides === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  }

  function handlePrev() {
    if (totalSlides === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  }

  function handleSelectSlide(index) {
    setCurrentIndex(index);
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (totalSlides === 0) return;
      if (event.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
      } else if (event.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
      } else if (event.key === "Escape" && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalSlides, isLightboxOpen]);

  useEffect(() => {
    if (!isAutoPlaying || totalSlides <= 1 || isLightboxOpen) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, 3200);

    return () => clearInterval(timer);
  }, [isAutoPlaying, totalSlides, isLightboxOpen]);

  useEffect(() => {
    if (thumbnailStripRef.current) {
      const activeThumb = thumbnailStripRef.current.querySelector(
        `.slider-thumb-btn[data-index="${currentIndex}"]`
      );
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [currentIndex]);

  const categoryCounts = {
    [CATEGORIES.ALL]: allSlides.length,
    [CATEGORIES.VIDEO_TOUR]: allSlides.filter(
      (slide) => slide.category === CATEGORIES.VIDEO_TOUR
    ).length,
    [CATEGORIES.ROOM_INNER]: allSlides.filter(
      (slide) => slide.category === CATEGORIES.ROOM_INNER
    ).length,
    [CATEGORIES.OUTER_FACILITIES]: allSlides.filter(
      (slide) => slide.category === CATEGORIES.OUTER_FACILITIES
    ).length,
    [CATEGORIES.SCENIC_VIEW]: allSlides.filter(
      (slide) => slide.category === CATEGORIES.SCENIC_VIEW
    ).length,
  };

  const currentSlide = displayedSlides[currentIndex] || displayedSlides[0];

  return (
    <div
      className="hotel-slider-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="slider-category-bar" role="tablist" aria-label="Photo Categories">
        {Object.entries(categoryCounts).map(([categoryName, count]) => {
          if (count === 0 && categoryName !== CATEGORIES.ALL) return null;
          const IconComponent = CATEGORY_ICONS[categoryName] || Images;
          const isSelected = selectedCategory === categoryName;

          return (
            <button
              key={categoryName}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`category-pill-btn ${isSelected ? "active" : ""}`}
              onClick={() => handleCategorySelect(categoryName)}
            >
              <IconComponent size={14} className="category-pill-icon" />
              <span>{categoryName}</span>
              <span className="category-pill-count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="slider-main-viewport">
        {totalSlides > 1 && (
          <button
            type="button"
            className="slider-nav-btn prev-btn"
            onClick={handlePrev}
            aria-label="Previous image"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft size={24} strokeWidth={2.4} />
          </button>
        )}

        {totalSlides > 1 && (
          <button
            type="button"
            className="slider-nav-btn next-btn"
            onClick={handleNext}
            aria-label="Next image"
            title="Next (Right Arrow)"
          >
            <ChevronRight size={24} strokeWidth={2.4} />
          </button>
        )}

        <div
          className="slider-track"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: "transform 0.42s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {displayedSlides.map((slide, index) => (
            <div
              key={slide.id || index}
              className={`slide-item ${index === currentIndex ? "active-slide" : ""}`}
            >
              {slide.type === "video" ? (
                <div className="slide-video-container">
                  <iframe
                    src={slide.videoUrl}
                    title={slide.title}
                    className="slide-video-iframe"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <>
                  <img
                    src={slide.url}
                    alt={slide.title || `${hotel.title} - ${slide.category}`}
                    className="slide-image"
                    loading={index <= 1 ? "eager" : "lazy"}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DEFAULT_HOTEL_IMAGE;
                    }}
                  />
                  <div className="slide-gradient-overlay" />
                </>
              )}
            </div>
          ))}
        </div>

        {isAutoPlaying && currentSlide?.type !== "video" && (
          <div className="slider-progress-track">
            <div key={currentIndex} className="slider-progress-fill" />
          </div>
        )}

        <div className="slider-top-badges">
          <div className="slider-tags-group">
            <span className="badge-luxury">
              <Sparkles size={12} /> LUXURY COLLECTION
            </span>
            <button
              type="button"
              className={`btn-watch-video-tour ${currentSlide?.type === "video" ? "active" : ""}`}
              onClick={() => {
                const videoIdx = allSlides.findIndex((s) => s.type === "video");
                if (videoIdx !== -1) {
                  setSelectedCategory(CATEGORIES.ALL);
                  setCurrentIndex(videoIdx);
                  setIsAutoPlaying(false);
                }
              }}
              title="Watch 4K Video Tour"
            >
              <Video size={13} /> 4K Video Tour
            </button>
            {currentSlide?.badge && (
              <span className="badge-category-tag">
                {currentSlide.category === CATEGORIES.ROOM_INNER && <Bed size={13} />}
                {currentSlide.category === CATEGORIES.OUTER_FACILITIES && <Trees size={13} />}
                {currentSlide.category === CATEGORIES.SCENIC_VIEW && <Compass size={13} />}
                {currentSlide.badge}
              </span>
            )}
          </div>

          <div className="slider-actions-group">
            {isAutoPlaying && (
              <span className="slide-playing-badge">
                <span className="pulse-dot" /> Tour Playing
              </span>
            )}

            <span className="slide-counter-pill">
              {currentIndex + 1} / {totalSlides}
            </span>

            <button
              type="button"
              className={`slider-action-icon-btn ${isAutoPlaying ? "active" : ""}`}
              onClick={() => setIsAutoPlaying((prevState) => !prevState)}
              aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
              title={isAutoPlaying ? "Pause tour" : "Play tour"}
            >
              {isAutoPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>

            <button
              type="button"
              className="slider-action-icon-btn"
              onClick={() => setIsLightboxOpen(true)}
              aria-label="View fullscreen photo"
              title="Expand to Fullscreen"
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </div>

        <div className="slider-bottom-details">
          <div className="slider-caption-block">
            <span className="slider-caption-category">{currentSlide?.category}</span>
            <h3 className="slider-caption-title">{currentSlide?.title}</h3>
            {currentSlide?.caption && (
              <p className="slider-caption-desc">{currentSlide.caption}</p>
            )}
          </div>

          {hotel.rating && (
            <div className="slider-rating-badge">
              <Star size={13} fill="#ffb400" color="#ffb400" />
              <span>
                {hotel.rating} ({hotel.reviews || 120} reviews)
              </span>
            </div>
          )}
        </div>

        {totalSlides > 1 && (
          <div className="slider-dots-container" role="tablist" aria-label="Slide Indicator Dots">
            {displayedSlides.map((_, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`slider-dot-btn ${isActive ? "active" : ""}`}
                  onClick={() => handleSelectSlide(index)}
                >
                  <span className="dot-inner" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div
        ref={thumbnailStripRef}
        className="slider-thumbnails-strip"
        aria-label="Photo Thumbnails"
      >
        {displayedSlides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={slide.id || index}
              data-index={index}
              type="button"
              className={`slider-thumb-btn ${isActive ? "active-thumb" : ""}`}
              onClick={() => handleSelectSlide(index)}
              aria-label={`View ${slide.title || slide.category}`}
            >
              <img
                src={slide.url}
                alt={slide.title || `Thumbnail ${index + 1}`}
                className="thumb-image"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_HOTEL_IMAGE;
                }}
              />
              {slide.type === "video" && (
                <div className="thumb-video-badge" aria-hidden="true">
                  <Play size={12} fill="#c6a16c" />
                </div>
              )}
              <span className="thumb-label">{slide.badge || slide.category}</span>
            </button>
          );
        })}
      </div>

      {isLightboxOpen && (
        <div
          className="slider-lightbox-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Photo Lightbox"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="lightbox-content-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close fullscreen view"
            >
              <X size={22} />
            </button>

            {totalSlides > 1 && (
              <button
                type="button"
                className="lightbox-nav-btn prev-btn"
                onClick={handlePrev}
                aria-label="Previous image"
              >
                <ChevronLeft size={28} />
              </button>
            )}

            {totalSlides > 1 && (
              <button
                type="button"
                className="lightbox-nav-btn next-btn"
                onClick={handleNext}
                aria-label="Next image"
              >
                <ChevronRight size={28} />
              </button>
            )}

            <div className="lightbox-image-wrapper">
              <img
                src={currentSlide?.url}
                alt={currentSlide?.title || hotel.title}
                className="lightbox-image"
              />
            </div>

            <div className="lightbox-footer-info">
              <div className="lightbox-caption-text">
                <span className="lightbox-badge">{currentSlide?.category}</span>
                <h4>{currentSlide?.title}</h4>
                <p>{currentSlide?.caption}</p>
              </div>
              <div className="lightbox-counter">
                {currentIndex + 1} / {totalSlides}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
