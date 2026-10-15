import { useMemo, useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Plus,
  X,
  ArrowDownWideNarrow,
  Hotel,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import HotelCard from "../components/HotelCard";
import HotelForm from "../components/HotelForm";
import Pagination from "../components/Pagination";
import SuccessPopup from "../components/SuccessPopup";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import {
  fetchHotelsAsync,
  addHotelAsync,
  updateHotelAsync,
  deleteHotelAsync,
} from "../redux/hotelSlice";
import "./HotelList.css";
const PAGE_SIZE = 4;
const PRICE_PRESETS = [
  { label: "All Prices", min: "", max: "" },
  { label: "Under ₹3,000", min: "", max: "3000" },
  { label: "₹3,000 – ₹5,000", min: "3000", max: "5000" },
  { label: "₹5,000 – ₹7,000", min: "5000", max: "7000" },
  { label: "₹7,000+", min: "7000", max: "" },
];
export default function HotelList() {
  const hotels = useSelector((state) => state.hotels.hotels);
  const dispatch = useDispatch();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("All Prices");
  const [sortBy, setSortBy] = useState("recommended");
  const [viewMode, setViewMode] = useState("list");
  const [page, setPage] = useState(1);
  const [editingHotel, setEditingHotel] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [hotelToDelete, setHotelToDelete] = useState(null);
  const [successPopup, setSuccessPopup] = useState({
    isOpen: false,
    title: "",
    message: "",
    hotelTitle: "",
  });
  const formSectionRef = useRef(null);
  useEffect(() => {
    dispatch(fetchHotelsAsync());
  }, [dispatch]);
  useEffect(() => {
    if (location.state?.openAdd) {
      openAddForm();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  const filteredHotels = useMemo(() => {
    const results = hotels.filter((hotel) => {
      const matchesTitle = hotel.title
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      const matchesMin =
        minPrice === "" || Number(hotel.price) >= Number(minPrice);
      const matchesMax =
        maxPrice === "" || Number(hotel.price) <= Number(maxPrice);
      return matchesTitle && matchesMin && matchesMax;
    });
    if (sortBy === "price-low") {
      results.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-high") {
      results.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "title") {
      results.sort((a, b) => a.title.localeCompare(b.title));
    }
    return results;
  }, [hotels, search, minPrice, maxPrice, sortBy]);
  const totalPages = Math.ceil(filteredHotels.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(totalPages, 1));
  const visibleHotels = filteredHotels.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );
  function openAddForm() {
    setEditingHotel(null);
    setShowForm(true);
    setTimeout(() => {
      if (formSectionRef.current) {
        formSectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  }
  function openEditForm(hotel) {
    setEditingHotel(hotel);
    setShowForm(true);
    setTimeout(() => {
      if (formSectionRef.current) {
        formSectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  }
  async function handleSaveHotel(formData) {
    if (editingHotel) {
      await dispatch(updateHotelAsync({ ...formData, id: editingHotel.id }));
      setSuccessPopup({
        isOpen: true,
        title: "Hotel Updated Successfully!",
        message: "Your changes have been saved to the database.",
        hotelTitle: formData.title,
      });
    } else {
      await dispatch(addHotelAsync(formData));
      setSuccessPopup({
        isOpen: true,
        title: "Hotel Added Successfully!",
        message: "A new hotel listing has been saved to the database.",
        hotelTitle: formData.title,
      });
    }
    setShowForm(false);
    setEditingHotel(null);
    setPage(1);
  }
  function requestDeleteHotel(hotel) {
    setHotelToDelete(hotel);
  }
  async function confirmDeleteHotel() {
    if (!hotelToDelete) return;
    const deletedTitle = hotelToDelete.title;
    await dispatch(deleteHotelAsync(hotelToDelete.id));

    setHotelToDelete(null);
    setSuccessPopup({
      isOpen: true,
      title: "Hotel Deleted Successfully!",
      message: `The listing for "${deletedTitle}" was deleted from the collection.`,
      hotelTitle: deletedTitle,
    });
    setPage(1);
  }
  function resetFilters() {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedPreset("All Prices");
    setPage(1);
  }
  function handlePresetClick(preset) {
    setSelectedPreset(preset.label);
    setMinPrice(preset.min);
    setMaxPrice(preset.max);
    setPage(1);
  }
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Haven & Hills Hotel Directory",
    "description": "Curated collection of luxury stays, boutique hotels and resorts.",
    "numberOfItems": hotels.length,
    "itemListElement": visibleHotels.map((h, idx) => ({
      "@type": "ListItem",
      "position": (safePage - 1) * PAGE_SIZE + idx + 1,
      "item": {
        "@type": "Hotel",
        "name": h.title,
        "description": h.description,
        "image": h.image,
        "priceRange": `₹${h.price}`,
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": h.latitude,
          "longitude": h.longitude
        }
      }
    }))
  };
  return (
    <>
      <Helmet>
        <title>Explore Luxury Hotels & Resorts | Haven & Hills</title>
        <meta
          name="description"
          content="Browse handpicked hotels and luxury boutique retreats. Filter by price range, search destinations, inspect geolocation coordinates, and manage hotel listings."
        />
        <meta name="keywords" content="luxury hotel list, boutique stays, hotel booking, price filter, geolocation map" />
        <meta property="og:title" content="Haven & Hills - Luxury Hotel Stays & Directory" />
        <meta property="og:description" content="Discover premium escapes and serene retreats across top destinations." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Explore Luxury Hotels | Haven & Hills" />
        <meta name="twitter:description" content="Search hotel stays, filter by price, and explore geolocation coordinates." />
        <script type="application/ld+json">
          {JSON.stringify(jsonLdData)}
        </script>
      </Helmet>

      <SuccessPopup
        isOpen={successPopup.isOpen}
        title={successPopup.title}
        message={successPopup.message}
        hotelTitle={successPopup.hotelTitle}
        onClose={() =>
          setSuccessPopup((prev) => ({ ...prev, isOpen: false }))
        }
      />
      <DeleteConfirmModal
        isOpen={Boolean(hotelToDelete)}
        hotel={hotelToDelete}
        onConfirm={confirmDeleteHotel}
        onCancel={() => setHotelToDelete(null)}
      />
      <main className="page-container" id="top">
        <section className="hero-banner">
          <div className="hero-copy">
            <span className="hero-eyebrow">CURATED HOSPITALITY</span>
            <h1>
              Find a stay that<br />feels like <em>your own sanctuary.</em>
            </h1>
            <p>
              Explore boutique luxury stays with verified GPS locations, transparent pricing, and instant details.
            </p>
          </div>
          <div className="hero-decoration" aria-hidden="true">
            <Hotel size={58} strokeWidth={1.2} />
          </div>
        </section>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <span>Home</span>
          <span>/</span>
          <strong>Explore Hotel Collection</strong>
        </nav>
        <section className="directory-heading" id="hotels">
          <div>
            <span className="section-eyebrow">THE RESORT COLLECTION</span>
            <h2>Explore Our Stays</h2>
            <p>Showing curated properties with full geolocation map coordinates.</p>
          </div>
          <button
            type="button"
            className="primary-button"
            onClick={openAddForm}
            id="btn-add-hotel-trigger"
          >
            <Plus size={18} />
            Add New Hotel
          </button>
        </section>

        {showForm && (
          <section
            ref={formSectionRef}
            id="add-hotel"
            aria-label="Add or Edit Hotel Form Section"
          >
            <HotelForm
              hotel={editingHotel}
              onSave={handleSaveHotel}
              onCancel={() => {
                setShowForm(false);
                setEditingHotel(null);
              }}
            />
          </section>
        )}
        <div className="directory-layout">
          <aside
            className={`filter-sidebar ${showFilters ? "" : "filters-hidden"}`}
            aria-label="Search and Filter Hotels"
          >
            <div className="filter-heading">
              <div className="filter-heading-left">
                <SlidersHorizontal size={17} />
                <h3>Refine Search</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                aria-label={showFilters ? "Hide filters" : "Show filters"}
                title={showFilters ? "Hide filters" : "Show filters"}
                className="btn-toggle-filters"
              >
                {showFilters ? <X size={17} /> : <SlidersHorizontal size={17} />}
              </button>
            </div>
            {showFilters && (
              <>
                <div className="filter-section">
                  <label htmlFor="hotel-search">Search by Hotel Name</label>
                  <div className="sidebar-search">
                    <Search size={16} />
                    <input
                      id="hotel-search"
                      type="search"
                      placeholder="e.g. Palm Retreat"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                    />
                    {search && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearch("");
                          setPage(1);
                        }}
                        className="btn-clear-search"
                        aria-label="Clear search query"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="filter-section">
                  <h4>Price Range (₹ per night)</h4>
                  <div className="price-presets-chips">
                    {PRICE_PRESETS.map((preset) => (
                      <button
                        type="button"
                        key={preset.label}
                        className={`price-preset-chip ${selectedPreset === preset.label ? "active" : ""
                          }`}
                        onClick={() => handlePresetClick(preset)}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  <div className="price-inputs-row">
                    <div className="price-input-group">
                      <label htmlFor="min-price">Min Price (₹)</label>
                      <input
                        id="min-price"
                        type="number"
                        min="0"
                        placeholder="No min"
                        value={minPrice}
                        onChange={(e) => {
                          setMinPrice(e.target.value);
                          setSelectedPreset("");
                          setPage(1);
                        }}
                      />
                    </div>
                    <div className="price-input-group">
                      <label htmlFor="max-price">Max Price (₹)</label>
                      <input
                        id="max-price"
                        type="number"
                        min="0"
                        placeholder="No max"
                        value={maxPrice}
                        onChange={(e) => {
                          setMaxPrice(e.target.value);
                          setSelectedPreset("");
                          setPage(1);
                        }}
                      />
                    </div>
                  </div>
                  {minPrice !== "" &&
                    maxPrice !== "" &&
                    Number(minPrice) > Number(maxPrice) && (
                      <p className="field-error-notice">
                        Min price must not exceed max price.
                      </p>
                    )}
                </div>
                <button
                  type="button"
                  className="reset-button"
                  onClick={resetFilters}
                >
                  <RotateCcw size={14} /> Clear All Filters
                </button>
              </>
            )}
          </aside>
          <section className="results-panel" aria-label="Hotel Listings">
            <div className="results-toolbar">
              <div className="results-count">
                <h3>Available Properties</h3>
                <span>
                  Showing {filteredHotels.length} stay
                  {filteredHotels.length === 1 ? "" : "s"}
                  {search && ` for "${search}"`}
                </span>
              </div>
              <div className="results-controls">
                <label className="sort-control">
                  <ArrowDownWideNarrow size={15} />
                  <select
                    aria-label="Sort hotels"
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setPage(1);
                    }}>
                    <option value="recommended">Featured / Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="title">Hotel Name: A to Z</option>
                  </select>
                </label>
                <div className="view-switch" role="group" aria-label="Display layout mode">
                  <button
                    type="button"
                    className={viewMode === "list" ? "selected" : ""}
                    onClick={() => setViewMode("list")}
                    aria-label="List layout"
                    title="List layout (default)"
                  >
                    <List size={18} />
                  </button>
                  <button
                    type="button"
                    className={viewMode === "grid" ? "selected" : ""}
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid layout"
                    title="Grid layout">
                    <LayoutGrid size={17} />
                  </button>
                </div>
              </div>
            </div>
            {minPrice !== "" &&
              maxPrice !== "" &&
              Number(minPrice) > Number(maxPrice) ? (
              <div className="empty-state">
                <Sparkles size={32} />
                <h3>Invalid Price Range</h3>
                <p>Please adjust your minimum and maximum prices.</p>
                <button
                  type="button"
                  className="primary-button"
                  onClick={resetFilters}>
                  Reset Price Filter
                </button>
              </div>
            ) : visibleHotels.length > 0 ? (
              <>
                <div className={`hotel-results ${viewMode}-view`}>
                  {visibleHotels.map((hotel) => (
                    <HotelCard
                      key={hotel.id}
                      hotel={hotel}
                      onEdit={openEditForm}
                      onDelete={requestDeleteHotel}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
                <div className="pagination-footer">
                  <span className="pagination-range-text">
                    Showing {(safePage - 1) * PAGE_SIZE + 1}–
                    {Math.min(safePage * PAGE_SIZE, filteredHotels.length)} of{" "}
                    {filteredHotels.length} hotels
                  </span>
                  <Pagination
                    currentPage={safePage}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              </>
            ) : (
              <div className="empty-state">
                <Search size={36} />
                <h3>No Hotels Found</h3>
                <p>
                  No hotels matched your search or price criteria. Try refining your filters or adding a new hotel.
                </p>
                <div className="empty-state-actions">
                  <button
                    type="button"
                    className="reset-button"
                    onClick={resetFilters}
                  >
                    Clear Filters
                  </button>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={openAddForm}
                  >
                    <Plus size={16} /> Add a Hotel
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
