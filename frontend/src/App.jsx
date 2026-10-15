import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HotelList from "./pages/HotelList";
import HotelDetails from "./pages/HotelDetails";
import MyBookings from "./pages/MyBookings";
import "./App.css";

function ScrollRestorationHelper() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollRestorationHelper />
      <div className="app-layout">
        <Navbar />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<HotelList />} />
            <Route path="/hotels/:id" element={<HotelDetails />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
