const fs = require("fs");
const path = require("path");

function writeFile(filePath, data) {
  return new Promise((resolve, reject) => {
    const buffer = Buffer.from(data);
    fs.writeFileSync(filePath, buffer, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function createDestinationFolder(filePath, relativePath) {
  const fileName = path.basename(filePath);
  const validName = fileName.replace(/[^a-zA-Z0-9]/g, "_");
  const destinationFolder = path.resolve(__dirname, relativePath + validName);

  if (!fs.existsSync(destinationFolder)) {
    fs.mkdirSync(destinationFolder);
  }

  return destinationFolder;
}

module.exports = {
  writeFile,
  createDestinationFolder,
};
