const fs = require("fs");
const path = require("path");

function joinFile(directoryPath, contentFile, turns) {
  return new Promise((resolve, reject) => {
    const fileBlocks = [];

    turns
      .sort((a, b) => Object.keys(a)[0] - Object.keys(b)[0])
      .forEach((turn, i) => {
        const blockIdentifier = turn[`${i}`];
        const data = Buffer.from(contentFile[blockIdentifier], "binary");
        fileBlocks.push(data);
      });

    const writeStream = fs.createWriteStream(path.resolve(directoryPath));

    writeStream.on("error", (err) => {
      reject(err);
    });

    writeStream.on("finish", () => {
      const filePath = path.resolve(directoryPath);
      resolve(filePath);
    });

    fileBlocks.forEach((block, i) => {
      writeStream.write(block);
      if (i === fileBlocks.length - 1) {
        writeStream.end();
      }
    });
  });
}

module.exports = joinFile;
