/**
 * Room Availability and Demo Reservation Mock Data & Simulation Utility
 * ---------------------------------------------------------------------
 * IMPORTANT: This is a frontend-only simulation utility for Haven & Hills.
 * All reservations and room inventories are simulated in localStorage.
 * No real reservations or backend requests are processed.
 */

export const BOOKINGS_STORAGE_KEY = "haven_hills_demo_bookings";

export const ROOM_TYPES = {
  standard: {
    id: "standard",
    name: "Standard Room",
    priceMultiplier: 0.85,
    maxGuests: 2,
    totalRooms: 8,
    bedType: "1 Queen Bed",
    size: "280 sq.ft.",
    description:
      "Comfortable and elegant retreat with soothing garden views, dedicated workstation, plush queen bedding, and private ensuite rain shower.",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1000&auto=format&fit=crop&q=80",
    amenities: [
      "Free High-Speed Wi-Fi",
      "Air Conditioning",
      "Rain Shower",
      "Tea & Coffee Maker",
      "43\" Smart TV",
      "Workstation Desk",
    ],
  },
  deluxe: {
    id: "deluxe",
    name: "Deluxe Room",
    priceMultiplier: 1.0,
    maxGuests: 3,
    totalRooms: 10,
    bedType: "1 King Bed or 2 Twin Beds",
    size: "380 sq.ft.",
    description:
      "Spacious luxury accommodation with private sun-drenched balcony, Italian marble vanity, plush sitting lounge, and curated artisan toiletries.",
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1000&auto=format&fit=crop&q=80",
    amenities: [
      "Private Scenic Balcony",
      "King / Twin Beds",
      "Mini Bar & Snacks",
      "Organic Toiletries",
      "55\" 4K Smart TV",
      "Complimentary Breakfast",
    ],
  },
  suite: {
    id: "suite",
    name: "Premium Suite",
    priceMultiplier: 1.45,
    maxGuests: 4,
    totalRooms: 5,
    bedType: "1 King Bed + 1 Premium Sofa Bed",
    size: "550 sq.ft.",
    description:
      "Our premier suite with separate living parlor, panoramic floor-to-ceiling vistas, deep freestanding soaking tub, and bespoke hospitality.",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000&auto=format&fit=crop&q=80",
    amenities: [
      "Panoramic Horizon Views",
      "Separate Living Parlor",
      "Deep Soaking Tub",
      "Nespresso Coffee Bar",
      "Personal Butler Service",
      "All-Inclusive Breakfast",
    ],
  },
};

/**
 * Format date to YYYY-MM-DD
 */
export function formatDateInput(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayString() {
  return formatDateInput(new Date());
}

export function getTomorrowString() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDateInput(tomorrow);
}

export function getDayAfterString(daysAhead = 2) {
  const target = new Date();
  target.setDate(target.getDate() + daysAhead);
  return formatDateInput(target);
}

/**
 * Calculate difference in nights between check-in and check-out.
 */
export function calculateNights(checkInStr, checkOutStr) {
  if (!checkInStr || !checkOutStr) return 1;
  const start = new Date(checkInStr);
  const end = new Date(checkOutStr);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}

/**
 * Check if two date ranges overlap.
 * Check-in is inclusive, check-out is exclusive.
 */
export function doDateRangesOverlap(startA, endA, startB, endB) {
  const sA = new Date(startA).getTime();
  const eA = new Date(endA).getTime();
  const sB = new Date(startB).getTime();
  const eB = new Date(endB).getTime();
  return sA < eB && eA > sB;
}

/**
 * Deterministic baseline reservations for upcoming dates per hotel.
 * Provides realistic limited availability / booked rooms on certain dates.
 */
function getBaselineReservedCount(hotelId, roomTypeId, checkInStr) {
  const checkInDate = new Date(checkInStr);
  const dayOfWeek = checkInDate.getDay();
  const dayOfMonth = checkInDate.getDate();
  const numericHotelId = Number(hotelId) || 1;

  const seed = (numericHotelId * 7 + dayOfMonth * 3 + dayOfWeek * 5) % 10;

  if (roomTypeId === "standard") {
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      return 6 + (seed % 3);
    }
    return 3 + (seed % 4);
  }

  if (roomTypeId === "deluxe") {
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      return 7 + (seed % 3);
    }
    return 4 + (seed % 4);
  }

  if (roomTypeId === "suite") {
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      return 3 + (seed % 3);
    }
    return 2 + (seed % 2);
  }

  return 3;
}

/**
 * Get stored demo reservations from localStorage
 */
export function getStoredBookings() {
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (err) {
    console.warn("Could not read demo bookings from storage", err);
    return [];
  }
}

/**
 * Save new demo booking to localStorage
 */
export function saveDemoBooking(booking) {
  const existing = getStoredBookings();
  const newBooking = {
    ...booking,
    id: `demo-booking-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    bookingReference: `HH-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    status: "Confirmed",
    createdAt: new Date().toISOString(),
  };

  const updated = [newBooking, ...existing];
  try {
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("haven_hills_bookings_updated"));
  } catch (err) {
    console.error("Failed to save demo booking", err);
  }

  return newBooking;
}

/**
 * Cancel a demo booking
 */
export function cancelDemoBooking(bookingIdOrRef) {
  const existing = getStoredBookings();
  const updated = existing.map((b) => {
    if (b.id === bookingIdOrRef || b.bookingReference === bookingIdOrRef) {
      return {
        ...b,
        status: "Cancelled",
        cancelledAt: new Date().toISOString(),
      };
    }
    return b;
  });

  try {
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("haven_hills_bookings_updated"));
    return true;
  } catch (err) {
    console.error("Failed to cancel demo booking", err);
    return false;
  }
}

/**
 * Completely remove a demo booking
 */
export function deleteDemoBooking(bookingIdOrRef) {
  const existing = getStoredBookings();
  const updated = existing.filter(
    (b) => b.id !== bookingIdOrRef && b.bookingReference !== bookingIdOrRef
  );

  try {
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("haven_hills_bookings_updated"));
    return true;
  } catch (err) {
    console.error("Failed to delete demo booking", err);
    return false;
  }
}

/**
 * Calculate dynamic room availability for a hotel and date range
 */
export function calculateRoomAvailability({
  hotelId,
  hotelBasePrice = 4500,
  checkIn,
  checkOut,
  requestedRooms = 1,
  adults = 2,
  children = 0,
  roomTypeFilter = "all",
}) {
  const nights = calculateNights(checkIn, checkOut);
  const totalGuests = Number(adults) + Number(children);
  const numRooms = Math.max(1, Number(requestedRooms) || 1);

  const allBookings = getStoredBookings();
  const activeUserBookings = allBookings.filter(
    (b) =>
      String(b.hotelId) === String(hotelId) &&
      b.status !== "Cancelled" &&
      doDateRangesOverlap(checkIn, checkOut, b.checkIn, b.checkOut)
  );

  const roomEntries = Object.values(ROOM_TYPES);
  const filteredRooms =
    roomTypeFilter && roomTypeFilter !== "all"
      ? roomEntries.filter((r) => r.id === roomTypeFilter)
      : roomEntries;

  return filteredRooms.map((room) => {
    const baselineReserved = getBaselineReservedCount(
      hotelId,
      room.id,
      checkIn,
      checkOut
    );

    const userBookedRoomsCount = activeUserBookings
      .filter((b) => b.roomTypeId === room.id)
      .reduce((sum, b) => sum + (Number(b.rooms) || 1), 0);

    const totalReserved = Math.min(
      room.totalRooms,
      baselineReserved + userBookedRoomsCount
    );

    const availableRooms = Math.max(0, room.totalRooms - totalReserved);

    const pricePerNight = Math.round(Number(hotelBasePrice) * room.priceMultiplier);
    const totalPrice = pricePerNight * nights * numRooms;

    const maxCapacity = room.maxGuests * numRooms;
    const isCapacityExceeded = totalGuests > maxCapacity;

    let statusLabel = "Available";
    let statusColor = "green";

    if (availableRooms === 0) {
      statusLabel = "Fully Booked";
      statusColor = "red";
    } else if (availableRooms <= 2) {
      statusLabel = "Limited Availability";
      statusColor = "orange";
    }

    const hasEnoughRooms = availableRooms >= numRooms;
    const canReserve = hasEnoughRooms && !isCapacityExceeded;

    let warningMessage = null;
    if (availableRooms === 0) {
      warningMessage = "Fully booked for selected dates.";
    } else if (!hasEnoughRooms) {
      warningMessage = `Only ${availableRooms} room${availableRooms > 1 ? "s" : ""} available (${numRooms} requested).`;
    } else if (isCapacityExceeded) {
      warningMessage = `Guest limit: ${numRooms} room(s) fits max ${maxCapacity} guests (${totalGuests} selected).`;
    }

    return {
      ...room,
      pricePerNight,
      totalPrice,
      nights,
      requestedRooms: numRooms,
      adults: Number(adults),
      children: Number(children),
      totalGuests,
      maxCapacity,
      totalRooms: room.totalRooms,
      availableRooms,
      reservedRooms: totalReserved,
      statusLabel,
      statusColor,
      canReserve,
      warningMessage,
      checkIn,
      checkOut,
    };
  });
}
