const { deleteUploadedFile } = require("../utils/fileHelper");

async function validateCreateHotel(req, res, next) {
  const errors = {};
  const { title, description, latitude, longitude, price, image } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    errors.title = "Title is required.";
  } else if (title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters long.";
  } else if (title.trim().length > 150) {
    errors.title = "Title cannot exceed 150 characters.";
  }

  if (!description || typeof description !== "string" || !description.trim()) {
    errors.description = "Description is required.";
  } else if (description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters long.";
  }

  if (latitude === undefined || latitude === null || latitude === "") {
    errors.latitude = "Latitude is required.";
  } else {
    const lat = Number(latitude);
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      errors.latitude = "Latitude must be a valid number between -90 and 90.";
    }
  }

  if (longitude === undefined || longitude === null || longitude === "") {
    errors.longitude = "Longitude is required.";
  } else {
    const lng = Number(longitude);
    if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
      errors.longitude = "Longitude must be a valid number between -180 and 180.";
    }
  }

  if (price === undefined || price === null || price === "") {
    errors.price = "Price is required.";
  } else {
    const pr = Number(price);
    if (!Number.isFinite(pr) || pr <= 0) {
      errors.price = "Price must be a positive number greater than 0.";
    }
  }

  const hasUploadedFile = Boolean(req.file);
  const hasImageUrl = Boolean(image && typeof image === "string" && image.trim());
  if (!hasUploadedFile && !hasImageUrl) {
    errors.image = "Hotel image file is required.";
  }

  if (Object.keys(errors).length > 0) {
    if (req.file) {
      await deleteUploadedFile(req.file.filename);
    }

    return res.status(400).json({
      success: false,
      message: "Validation failed. Please correct the invalid fields.",
      errors,
    });
  }

  next();
}

async function validateUpdateHotel(req, res, next) {
  const errors = {};
  const { title, description, latitude, longitude, price } = req.body;

  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      errors.title = "Title cannot be empty.";
    } else if (title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters long.";
    } else if (title.trim().length > 150) {
      errors.title = "Title cannot exceed 150 characters.";
    }
  }

  if (description !== undefined) {
    if (typeof description !== "string" || !description.trim()) {
      errors.description = "Description cannot be empty.";
    } else if (description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters long.";
    }
  }

  if (latitude !== undefined) {
    const lat = Number(latitude);
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      errors.latitude = "Latitude must be a valid number between -90 and 90.";
    }
  }

  if (longitude !== undefined) {
    const lng = Number(longitude);
    if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
      errors.longitude = "Longitude must be a valid number between -180 and 180.";
    }
  }

  if (price !== undefined) {
    const pr = Number(price);
    if (!Number.isFinite(pr) || pr <= 0) {
      errors.price = "Price must be a positive number greater than 0.";
    }
  }

  if (Object.keys(errors).length > 0) {
    if (req.file) {
      await deleteUploadedFile(req.file.filename);
    }

    return res.status(400).json({
      success: false,
      message: "Validation failed for update.",
      errors,
    });
  }

  next();
}

module.exports = {
  validateCreateHotel,
  validateUpdateHotel,
};
