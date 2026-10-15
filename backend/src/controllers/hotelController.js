const { query } = require("../config/db");
const { deleteUploadedFile } = require("../utils/fileHelper");

async function createHotel(req, res, next) {
  try {
    const { title, description, latitude, longitude, price, rating, reviews } = req.body;

    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      imagePath = req.body.image.trim();
    }

    const insertSql = `
      INSERT INTO hotels (title, description, latitude, longitude, price, image, rating, reviews)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [
      title.trim(),
      description.trim(),
      Number(latitude),
      Number(longitude),
      Number(price),
      imagePath,
      rating ? Number(rating) : 4.7,
      reviews ? Number(reviews) : 1,
    ];

    const result = await query(insertSql, values);
    const newHotel = result.rows[0];

    return res.status(201).json({
      success: true,
      message: "Hotel created successfully",
      data: newHotel,
    });
  } catch (err) {
    if (req.file) {
      await deleteUploadedFile(req.file.filename);
    }
    next(err);
  }
}

async function updateHotel(req, res, next) {
  try {
    const hotelId = Number(req.params.id);
    if (!hotelId || isNaN(hotelId) || hotelId <= 0) {
      if (req.file) await deleteUploadedFile(req.file.filename);
      return res.status(400).json({
        success: false,
        message: "Invalid hotel ID",
      });
    }

    const existing = await query("SELECT * FROM hotels WHERE id = $1;", [hotelId]);
    if (existing.rows.length === 0) {
      if (req.file) await deleteUploadedFile(req.file.filename);
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    const currentHotel = existing.rows[0];
    const { title, description, latitude, longitude, price, rating, reviews } = req.body;

    let newImagePath = currentHotel.image;
    if (req.file) {
      newImagePath = `/uploads/${req.file.filename}`;
      await deleteUploadedFile(currentHotel.image);
    } else if (req.body.image && req.body.image.trim()) {
      newImagePath = req.body.image.trim();
    }

    const updateSql = `
      UPDATE hotels
      SET 
        title = $1,
        description = $2,
        latitude = $3,
        longitude = $4,
        price = $5,
        image = $6,
        rating = $7,
        reviews = $8,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *;
    `;

    const values = [
      title !== undefined ? title.trim() : currentHotel.title,
      description !== undefined ? description.trim() : currentHotel.description,
      latitude !== undefined ? Number(latitude) : currentHotel.latitude,
      longitude !== undefined ? Number(longitude) : currentHotel.longitude,
      price !== undefined ? Number(price) : currentHotel.price,
      newImagePath,
      rating !== undefined ? Number(rating) : currentHotel.rating,
      reviews !== undefined ? Number(reviews) : currentHotel.reviews,
      hotelId,
    ];

    const result = await query(updateSql, values);
    return res.status(200).json({
      success: true,
      message: "Hotel updated successfully",
      data: result.rows[0],
    });
  } catch (err) {
    if (req.file) {
      await deleteUploadedFile(req.file.filename);
    }
    next(err);
  }
}

async function deleteHotel(req, res, next) {
  try {
    const hotelId = Number(req.params.id);
    if (!hotelId || isNaN(hotelId) || hotelId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid hotel ID",
      });
    }

    const existing = await query("SELECT * FROM hotels WHERE id = $1;", [hotelId]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    const hotel = existing.rows[0];
    await query("DELETE FROM hotels WHERE id = $1;", [hotelId]);

    if (hotel.image) {
      await deleteUploadedFile(hotel.image);
    }

    return res.status(200).json({
      success: true,
      message: "Hotel deleted successfully",
      deletedId: hotelId,
    });
  } catch (err) {
    next(err);
  }
}

async function getHotels(req, res, next) {
  try {
    const { title, minPrice, maxPrice, limit = 100, page = 1, sortBy = "recommended" } = req.query;

    const limitNum = Math.max(1, Math.min(Number(limit) || 100, 100));
    const pageNum = Math.max(1, Number(page) || 1);
    const offset = (pageNum - 1) * limitNum;

    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (title && title.trim()) {
      conditions.push(`title ILIKE $${paramIndex}`);
      params.push(`%${title.trim()}%`);
      paramIndex++;
    }

    if (minPrice !== undefined && minPrice !== "") {
      const min = Number(minPrice);
      if (!isNaN(min)) {
        conditions.push(`price >= $${paramIndex}`);
        params.push(min);
        paramIndex++;
      }
    }

    if (maxPrice !== undefined && maxPrice !== "") {
      const max = Number(maxPrice);
      if (!isNaN(max)) {
        conditions.push(`price <= $${paramIndex}`);
        params.push(max);
        paramIndex++;
      }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await query(`SELECT COUNT(*) AS total FROM hotels ${whereClause};`, params);
    const total = parseInt(countResult.rows[0].total, 10);

    let orderClause = "ORDER BY id DESC";
    if (sortBy === "recommended") {
      orderClause = "ORDER BY rating DESC, reviews DESC, id DESC";
    } else if (sortBy === "price-low") {
      orderClause = "ORDER BY price ASC, id ASC";
    } else if (sortBy === "price-high") {
      orderClause = "ORDER BY price DESC, id DESC";
    } else if (sortBy === "title") {
      orderClause = "ORDER BY title ASC";
    } else if (sortBy === "oldest") {
      orderClause = "ORDER BY id ASC";
    }

    const dataSql = `
      SELECT id, title, description, latitude, longitude, price, image, rating, reviews, created_at, updated_at
      FROM hotels
      ${whereClause}
      ${orderClause}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1};
    `;

    const dataResult = await query(dataSql, [...params, limitNum, offset]);
    const totalPages = Math.ceil(total / limitNum) || 1;

    return res.status(200).json({
      success: true,
      pagination: {
        total,
        limit: limitNum,
        page: pageNum,
        totalPages,
        hasPrevPage: pageNum > 1,
        hasNextPage: pageNum < totalPages,
      },
      data: dataResult.rows,
    });
  } catch (err) {
    next(err);
  }
}

async function getHotelById(req, res, next) {
  try {
    const hotelId = Number(req.params.id);
    if (!hotelId || isNaN(hotelId) || hotelId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid hotel ID",
      });
    }

    const result = await query("SELECT * FROM hotels WHERE id = $1;", [hotelId]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createHotel,
  updateHotel,
  deleteHotel,
  getHotels,
  getHotelById,
};
