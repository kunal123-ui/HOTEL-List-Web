import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
});

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

export async function fetchHotels(params = {}) {
  const response = await apiClient.get("/hotels", { params });
  return response.data;
}

export async function fetchHotelById(id) {
  const response = await apiClient.get(`/hotels/${id}`);
  return response.data;
}

export async function createHotelApi(data) {
  const response = await apiClient.post("/hotels", data);
  return response.data;
}

export async function updateHotelApi(id, data) {
  const response = await apiClient.put(`/hotels/${id}`, data);
  return response.data;
}

export async function deleteHotelApi(id, deleteImage = true) {
  const response = await apiClient.delete(`/hotels/${id}`, {
    params: { deleteImage },
  });
  return response.data;
}

export default apiClient;
