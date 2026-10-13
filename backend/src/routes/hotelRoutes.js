const express = require("express");
const upload = require("../middleware/upload");
const {
  validateCreateHotel,
  validateUpdateHotel,
} = require("../middleware/validate");
const {
  createHotel,
  updateHotel,
  deleteHotel,
  getHotels,
  getHotelById,
} = require("../controllers/hotelController");

const router = express.Router();

router.get("/", getHotels);
router.get("/:id", getHotelById);
router.post("/", upload.single("image"), validateCreateHotel, createHotel);
router.put("/:id", upload.single("image"), validateUpdateHotel, updateHotel);
router.delete("/:id", deleteHotel);

module.exports = router;
