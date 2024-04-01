const fs = require("fs");

function fileExists(filePath) {
  try {
    const exists = fs.existsSync(filePath);
    return exists;
  } catch (error) {
    console.error("Error validating file existence:", error);
    return null;
  }
}

module.exports = fileExists;
