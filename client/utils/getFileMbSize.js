const fs = require("fs");

function getFileMbSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size / 1000000;
  } catch (error) {
    console.error("Error getting the file size:", error);
    return null;
  }
}

module.exports = getFileMbSize;
