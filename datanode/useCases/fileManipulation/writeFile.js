const fs = require("fs");

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

module.exports = writeFile;
