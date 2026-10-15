const fs = require("fs");
const path = require("path");

const UPLOADS_DIR = path.join(__dirname, "../../uploads");

async function deleteUploadedFile(imagePath) {
  if (!imagePath || typeof imagePath !== "string") {
    return false;
  }

  // Do not delete web URLs
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return false;
  }

  try {
    const filename = path.basename(imagePath);
    const filePath = path.join(UPLOADS_DIR, filename);

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
  } catch (err) {
    console.error("Error deleting file:", err.message);
  }

  return false;
}

module.exports = {
  deleteUploadedFile,
};
