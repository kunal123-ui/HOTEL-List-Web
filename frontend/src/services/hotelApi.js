import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
});

/**
 * Helper to get the displayable URL for a hotel image.
 * If the image path is relative (e.g. /uploads/image.jpg), it appends the backend base URL.
 */
export const DEFAULT_HOTEL_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop&q=80";

export function getImageUrl(imagePath) {
  if (!imagePath) return DEFAULT_HOTEL_IMAGE;
  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("data:")
  ) {
    return imagePath;
  }
  if (imagePath.startsWith("/")) {
    return `${API_BASE_URL}${imagePath}`;
  }
  return `${API_BASE_URL}/${imagePath}`;
}

/**
 * 1. Fetch hotels with filters and pagination
 * @param {Object} params - { title, minPrice, maxPrice, limit, offset, page, sortBy }
 */
export async function fetchHotels(params = {}) {
  const response = await apiClient.get("/hotels", { params });
  return response.data;
}

/**
 * 2. Fetch single hotel by ID
 */
export async function fetchHotelById(id) {
  const response = await apiClient.get(`/hotels/${id}`);
  return response.data;
}

/**
 * 3. Create a new hotel (supports file upload via FormData)
 * @param {FormData|Object} data
 */
export async function createHotelApi(data) {
  const isFormData = data instanceof FormData;
  const response = await apiClient.post("/hotels", data, {
    headers: isFormData
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" },
  });
  return response.data;
}

/**
 * 4. Update an existing hotel by ID
 * @param {number|string} id
 * @param {FormData|Object} data
 */
export async function updateHotelApi(id, data) {
  const isFormData = data instanceof FormData;
  const response = await apiClient.put(`/hotels/${id}`, data, {
    headers: isFormData
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" },
  });
  return response.data;
}

/**
 * 5. Delete a hotel by ID
 * @param {number|string} id
 * @param {boolean} deleteImage
 */
export async function deleteHotelApi(id, deleteImage = true) {
  const response = await apiClient.delete(`/hotels/${id}`, {
    params: { deleteImage },
  });
  return response.data;
}

export default apiClient;
