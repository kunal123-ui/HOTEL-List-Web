const fs = require("fs");
const path = require("path");

const UPLOADS_DIR = path.join(__dirname, "../../uploads");

async function deleteUploadedFile(imagePath) {
  if (!imagePath || typeof imagePath !== "string") {
    return false;
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return false;
  }

  try {
    const filename = path.basename(imagePath);
    const absolutePath = path.join(UPLOADS_DIR, filename);

    if (!absolutePath.startsWith(UPLOADS_DIR)) {
      console.warn("Attempted directory traversal detected in file deletion:", imagePath);
      return false;
    }

    if (fs.existsSync(absolutePath)) {
      await fs.promises.unlink(absolutePath);
      console.log(`Deleted file from server: ${filename}`);
      return true;
    }
  } catch (err) {
    console.error(`Error deleting file ${imagePath}:`, err.message);
  }

  return false;
}

module.exports = {
  UPLOADS_DIR,
  deleteUploadedFile,
};
