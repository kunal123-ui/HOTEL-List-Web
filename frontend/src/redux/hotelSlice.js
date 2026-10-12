import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "haven_hills_hotels_data";

const defaultHotels = [
  {
    id: 1,
    title: "The Palm Retreat",
    description: "Relax in a tropical luxury resort with a beautiful swimming pool, spacious rooms, lush garden views, private cabanas, and premium hospitality crafted for leisure.",
    price: 4500,
    latitude: 13.0827,
    longitude: 80.2707,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviews: 142,
    city: "Chennai",
    amenities: ["Free Wi-Fi", "Swimming Pool", "Spa & Wellness", "Restaurant", "Free Parking"]
  },
  {
    id: 2,
    title: "Ocean Pearl Resort",
    description: "Enjoy a peaceful coastal escape with modern interiors, ocean-inspired spaces, relaxing sound of waves, and beachside dining experiences.",
    price: 6500,
    latitude: 9.9252,
    longitude: 78.1198,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1000&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviews: 210,
    city: "Madurai / Coast",
    amenities: ["Ocean View", "Free Breakfast", "Infinity Pool", "Cocktail Bar", "Airport Shuttle"]
  },
  {
    id: 3,
    title: "Green Valley Escape",
    description: "A comfortable nature retreat for families and weekend travellers, surrounded by mist-covered hills, organic plantation walks, and fresh mountain air.",
    price: 2800,
    latitude: 11.0168,
    longitude: 76.9558,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviews: 88,
    city: "Coimbatore",
    amenities: ["Nature Trails", "Bonfire", "Kid Friendly", "Pet Friendly", "Garden Restaurant"]
  },
  {
    id: 4,
    title: "The Ivory Suites",
    description: "Contemporary urban accommodation with elegant suites, convenient business hub access, rooftop lounge, and thoughtful executive guest facilities.",
    price: 5200,
    latitude: 12.9716,
    longitude: 77.5946,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1000&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviews: 175,
    city: "Bengaluru",
    amenities: ["Fitness Center", "High-speed Wi-Fi", "Business Center", "Room Service", "Bar"]
  },
  {
    id: 5,
    title: "Hilltop Heritage Stay",
    description: "Discover a charming hill retreat with warm wooden interiors, colonial architecture, scenic panoramic valley vistas, and a relaxing fireplace atmosphere.",
    price: 3200,
    latitude: 10.0889,
    longitude: 77.0595,
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1000&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviews: 95,
    city: "Munnar",
    amenities: ["Mountain View", "Fireplace", "Tea Tasting", "Balcony", "Free Wi-Fi"]
  },
  {
    id: 6,
    title: "Royal Courtyard Hotel",
    description: "Experience classic palatial elegance with beautifully styled courtyard corridors, comfortable luxury suites, chandeliers, and royal culinary hospitality.",
    price: 7800,
    latitude: 17.385,
    longitude: 78.4867,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1000&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviews: 320,
    city: "Hyderabad",
    amenities: ["Heritage Architecture", "Valet Parking", "Fine Dining", "Concierge", "Spa"]
  },
  {
    id: 7,
    title: "Cedar House Boutique",
    description: "A welcoming boutique stay with natural stone textures, quiet pine tree surroundings, artisan breakfast, and cosy rooms for a thoroughly restful holiday.",
    price: 2400,
    latitude: 11.4102,
    longitude: 76.695,
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1000&auto=format&fit=crop&q=80",
    rating: 4.5,
    reviews: 64,
    city: "Ooty",
    amenities: ["Artisan Breakfast", "Garden Gazebo", "Library Lounge", "Free Wi-Fi"]
  },
];

function loadSavedHotels() {
  if (typeof window === "undefined") return defaultHotels;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not load hotels from localStorage:", err);
  }
  return defaultHotels;
}

function saveHotelsToStorage(hotels) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hotels));
  } catch (err) {
    console.warn("Could not save hotels to localStorage:", err);
  }
}

const initialState = {
  hotels: loadSavedHotels(),
};

const hotelSlice = createSlice({
  name: "hotels",
  initialState,
  reducers: {
    addHotel: (state, action) => {
      const newHotel = {
        ...action.payload,
        id: action.payload.id || Date.now(),
        rating: action.payload.rating || 4.7,
        reviews: action.payload.reviews || 1,
        amenities: action.payload.amenities || [
          "Free Wi-Fi",
          "Air Conditioning",
          "Room Service",
        ],
      };
      state.hotels.unshift(newHotel);
      saveHotelsToStorage(state.hotels);
    },
    updateHotel: (state, action) => {
      const index = state.hotels.findIndex(
        (hotel) => String(hotel.id) === String(action.payload.id)
      );
      if (index !== -1) {
        state.hotels[index] = {
          ...state.hotels[index],
          ...action.payload,
        };
        saveHotelsToStorage(state.hotels);
      }
    },
    deleteHotel: (state, action) => {
      state.hotels = state.hotels.filter(
        (hotel) => String(hotel.id) !== String(action.payload)
      );
      saveHotelsToStorage(state.hotels);
    },
    resetHotels: (state) => {
      state.hotels = defaultHotels;
      saveHotelsToStorage(defaultHotels);
    },
  },
});

export const { addHotel, updateHotel, deleteHotel, resetHotels } = hotelSlice.actions;
export default hotelSlice.reducer;
