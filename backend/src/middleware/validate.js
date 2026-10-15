const { deleteUploadedFile } = require("../utils/fileHelper");

async function validateCreateHotel(req, res, next) {
  const { title, description, latitude, longitude, price, image } = req.body;
  const errors = {};

  if (!title || !title.trim()) {
    errors.title = "Title is required";
  }

  if (!description || !description.trim()) {
    errors.description = "Description is required";
  }

  const lat = Number(latitude);
  if (latitude === undefined || latitude === "" || isNaN(lat) || lat < -90 || lat > 90) {
    errors.latitude = "Latitude must be a valid number between -90 and 90";
  }

  const lng = Number(longitude);
  if (longitude === undefined || longitude === "" || isNaN(lng) || lng < -180 || lng > 180) {
    errors.longitude = "Longitude must be a valid number between -180 and 180";
  }

  const pr = Number(price);
  if (price === undefined || price === "" || isNaN(pr) || pr <= 0) {
    errors.price = "Price must be greater than 0";
  }

  const hasImage = Boolean(req.file || (image && image.trim()));
  if (!hasImage) {
    errors.image = "Hotel image is required";
  }

  if (Object.keys(errors).length > 0) {
    if (req.file) {
      await deleteUploadedFile(req.file.filename);
    }
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
}

async function validateUpdateHotel(req, res, next) {
  const { title, description, latitude, longitude, price } = req.body;
  const errors = {};

  if (title !== undefined && (!title || !title.trim())) {
    errors.title = "Title cannot be empty";
  }

  if (description !== undefined && (!description || !description.trim())) {
    errors.description = "Description cannot be empty";
  }

  if (latitude !== undefined) {
    const lat = Number(latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.latitude = "Latitude must be between -90 and 90";
    }
  }

  if (longitude !== undefined) {
    const lng = Number(longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.longitude = "Longitude must be between -180 and 180";
    }
  }

  if (price !== undefined) {
    const pr = Number(price);
    if (isNaN(pr) || pr <= 0) {
      errors.price = "Price must be greater than 0";
    }
  }

  if (Object.keys(errors).length > 0) {
    if (req.file) {
      await deleteUploadedFile(req.file.filename);
    }
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
}

module.exports = {
  validateCreateHotel,
  validateUpdateHotel,
};
