const fs = require("fs");

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    console.error("Error getting the file size:", error);
    return null;
  }
}

module.exports = getFileSize;
