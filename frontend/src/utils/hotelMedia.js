import { getImageUrl, DEFAULT_HOTEL_IMAGE } from "../services/hotelApi";

export const CATEGORIES = {
  ALL: "All Photos",
  VIDEO_TOUR: "Video Tour",
  ROOM_INNER: "Room Inner",
  OUTER_FACILITIES: "Outer Facilities",
  SCENIC_VIEW: "Scenic View",
  EXTERIOR: "Exterior",
};

const PHOTO_PRESETS = {
  coastal: {
    roomInner: [
      {
        url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&auto=format&fit=crop&q=80",
        title: "Deluxe Ocean-Facing Master Suite",
        caption: "King-size bed with Egyptian cotton linens, ambient bedside lighting, and panoramic glass doors.",
        badge: "Room Inner",
      },
      {
        url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&auto=format&fit=crop&q=80",
        title: "Marble Ensuite Bathroom & Rain Shower",
        caption: "Designer vanity with Italian marble countertops, freestanding tub, and luxury organic toiletries.",
        badge: "Room Inner",
      },
      {
        url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200&auto=format&fit=crop&q=80",
        title: "Coastal Living Suite & Private Lounge",
        caption: "Open-plan living area with bespoke furnishings and morning ocean breeze.",
        badge: "Room Inner",
      },
    ],
    outerFacilities: [
      {
        url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1200&auto=format&fit=crop&q=80",
        title: "Heated Infinity Swimming Pool & Sun Deck",
        caption: "Crystal-clear waters with submerged sun loungers and towel service.",
        badge: "Outer Facility",
      },
      {
        url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&auto=format&fit=crop&q=80",
        title: "Open-Air Beachside Dining Terrace",
        caption: "Alfresco evening dining offering catch-of-the-day specials and craft cocktails.",
        badge: "Outer Facility",
      },
      {
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&auto=format&fit=crop&q=80",
        title: "Private Poolside Cabanas & Palms",
        caption: "Secluded cabana lounge spots nestled among tropical palm trees.",
        badge: "Outer Facility",
      },
    ],
    scenicView: [
      {
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
        title: "Sunset Ocean Horizon from Balcony",
        caption: "Golden hour sunset reflections casting warm hues across the open sea.",
        badge: "Scenic View",
      },
      {
        url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&auto=format&fit=crop&q=80",
        title: "Panoramic Coastal Shoreline Vista",
        caption: "Unobstructed turquoise waters and gentle rolling tides.",
        badge: "Scenic View",
      },
    ],
  },

  mountain: {
    roomInner: [
      {
        url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=80",
        title: "Pine-Accented Mountain Master Suite",
        caption: "Warm timber paneling, plush duvet, and scenic picture windows overlooking the valley.",
        badge: "Room Inner",
      },
      {
        url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&auto=format&fit=crop&q=80",
        title: "Cosy Heritage Suite with Fireplace",
        caption: "Intimate seating beside the stone fireplace with artisan wool throws.",
        badge: "Room Inner",
      },
      {
        url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&auto=format&fit=crop&q=80",
        title: "Luxury Heated Stone Bathroom",
        caption: "Deep soaking tub and rain shower with views of the mountain pines.",
        badge: "Room Inner",
      },
    ],
    outerFacilities: [
      {
        url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&fit=crop&q=80",
        title: "Outdoor Wellness Spa & Herbal Jacuzzi",
        caption: "Natural steam and geothermal relaxation surrounded by mountain flora.",
        badge: "Outer Facility",
      },
      {
        url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&auto=format&fit=crop&q=80",
        title: "Landscaped Garden Gazebo & Lawn",
        caption: "Gentle walking paths and firepit for evening stargazing sessions.",
        badge: "Outer Facility",
      },
      {
        url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80",
        title: "Heated Courtyard Pool & Sun Deck",
        caption: "Temperature-controlled swimming pool nestled in the hill slope.",
        badge: "Outer Facility",
      },
    ],
    scenicView: [
      {
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80",
        title: "Mist-Covered Valley Panoramic Vista",
        caption: "Spectacular morning clouds rolling through lush mountain ridges.",
        badge: "Scenic View",
      },
      {
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80",
        title: "Sunset Glow Over Mountain Peaks",
        caption: "Vivid orange and violet skies viewed from the private observation deck.",
        badge: "Scenic View",
      },
    ],
  },

  urban: {
    roomInner: [
      {
        url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&auto=format&fit=crop&q=80",
        title: "Presidential Luxury Suite & King Bed",
        caption: "Custom velvet headboard, smart room automation, and floor-to-ceiling glass.",
        badge: "Room Inner",
      },
      {
        url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&auto=format&fit=crop&q=80",
        title: "Executive Work Suite & Lounge",
        caption: "Ergonomic workspace, high-speed connectivity, and plush lounge seating.",
        badge: "Room Inner",
      },
      {
        url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&auto=format&fit=crop&q=80",
        title: "Polished Granite Spa Bathroom",
        caption: "Dual vanity basins, frameless glass shower, and deep hydrotherapy bath.",
        badge: "Room Inner",
      },
    ],
    outerFacilities: [
      {
        url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80",
        title: "Illuminated Resort Pool & Sundeck",
        caption: "Stunning evening lighting with comfortable loungers and poolside service.",
        badge: "Outer Facility",
      },
      {
        url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80",
        title: "Rooftop Sky Lounge & Cocktail Bar",
        caption: "Sophisticated open-air social space featuring live acoustic evenings.",
        badge: "Outer Facility",
      },
      {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80",
        title: "Grand Entrance Courtyard & Fountains",
        caption: "Lushly landscaped courtyard arrival with valet reception.",
        badge: "Outer Facility",
      },
    ],
    scenicView: [
      {
        url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&auto=format&fit=crop&q=80",
        title: "Panoramic Skyline & Sunset Vista",
        caption: "Sweeping cityscape and horizon glow from the upper-floor balconies.",
        badge: "Scenic View",
      },
      {
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
        title: "Sunset Horizon Terrace View",
        caption: "Breathtaking twilight colors creating the perfect holiday backdrop.",
        badge: "Scenic View",
      },
    ],
  },
};

function detectPresetStyle(hotel) {
  const text = `${hotel.title || ""} ${hotel.description || ""}`.toLowerCase();
  if (
    text.includes("ocean") ||
    text.includes("breeze") ||
    text.includes("beach") ||
    text.includes("coastal") ||
    text.includes("pearl") ||
    text.includes("sea") ||
    text.includes("palm")
  ) {
    return "coastal";
  }
  if (
    text.includes("hill") ||
    text.includes("valley") ||
    text.includes("mountain") ||
    text.includes("escape") ||
    text.includes("cedar") ||
    text.includes("heritage") ||
    text.includes("green") ||
    text.includes("mist")
  ) {
    return "mountain";
  }
  return "urban";
}

export function getHotelGallery(hotel) {
  if (!hotel) return [];

  const mainImageUrl = hotel.image ? getImageUrl(hotel.image) : DEFAULT_HOTEL_IMAGE;
  const presetKey = detectPresetStyle(hotel);
  const preset = PHOTO_PRESETS[presetKey] || PHOTO_PRESETS.coastal;

  const customImages = Array.isArray(hotel.gallery)
    ? hotel.gallery
    : Array.isArray(hotel.images)
    ? hotel.images
    : [];

  const slides = [];

  slides.push({
    id: "main-hero",
    type: "image",
    url: mainImageUrl,
    title: hotel.title,
    caption: `Full property exterior, architectural facade, and welcome grounds of ${hotel.title}.`,
    category: CATEGORIES.EXTERIOR,
    badge: "Main Overview",
  });

  slides.push({
    id: "video-tour",
    type: "video",
    url: mainImageUrl,
    videoUrl: "https://www.youtube-nocookie.com/embed/nDvjTjynKYw?autoplay=1&mute=1&loop=1&playlist=nDvjTjynKYw&rel=0",
    title: `${hotel.title} - 4K Virtual Video Tour`,
    caption: `Immersive 4K cinematic property walkthrough and luxury retreat tour of ${hotel.title}.`,
    category: CATEGORIES.VIDEO_TOUR,
    badge: "4K Video Tour",
  });

  if (customImages.some((img) => img.category === CATEGORIES.ROOM_INNER)) {
    customImages
      .filter((img) => img.category === CATEGORIES.ROOM_INNER)
      .forEach((img, index) => {
        slides.push({
          id: `custom-room-${index}`,
          url: getImageUrl(img.url || img),
          title: img.title || `${hotel.title} - Room Inner View`,
          caption: img.caption || "Spacious guest room interior with premium amenities.",
          category: CATEGORIES.ROOM_INNER,
          badge: "Room Inner",
        });
      });
  } else {
    preset.roomInner.forEach((photo, index) => {
      slides.push({
        id: `preset-room-${index}`,
        url: photo.url,
        title: photo.title,
        caption: photo.caption,
        category: CATEGORIES.ROOM_INNER,
        badge: "Room Inner",
      });
    });
  }

  if (customImages.some((img) => img.category === CATEGORIES.OUTER_FACILITIES)) {
    customImages
      .filter((img) => img.category === CATEGORIES.OUTER_FACILITIES)
      .forEach((img, index) => {
        slides.push({
          id: `custom-facility-${index}`,
          url: getImageUrl(img.url || img),
          title: img.title || `${hotel.title} - Outer Facility`,
          caption: img.caption || "Resort outdoor amenities and guest recreation areas.",
          category: CATEGORIES.OUTER_FACILITIES,
          badge: "Outer Facility",
        });
      });
  } else {
    preset.outerFacilities.forEach((photo, index) => {
      slides.push({
        id: `preset-facility-${index}`,
        url: photo.url,
        title: photo.title,
        caption: photo.caption,
        category: CATEGORIES.OUTER_FACILITIES,
        badge: "Outer Facility",
      });
    });
  }

  if (customImages.some((img) => img.category === CATEGORIES.SCENIC_VIEW)) {
    customImages
      .filter((img) => img.category === CATEGORIES.SCENIC_VIEW)
      .forEach((img, index) => {
        slides.push({
          id: `custom-view-${index}`,
          url: getImageUrl(img.url || img),
          title: img.title || `${hotel.title} - Scenic View`,
          caption: img.caption || "Panoramic scenery and horizon vista from the property.",
          category: CATEGORIES.SCENIC_VIEW,
          badge: "Scenic View",
        });
      });
  } else {
    preset.scenicView.forEach((photo, index) => {
      slides.push({
        id: `preset-view-${index}`,
        url: photo.url,
        title: photo.title,
        caption: photo.caption,
        category: CATEGORIES.SCENIC_VIEW,
        badge: "Scenic View",
      });
    });
  }

  return slides;
}
