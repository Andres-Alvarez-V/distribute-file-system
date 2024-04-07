const fs = require("fs");
const path = require("path");
const { writeFile, createDestinationFolder } = require("./writeFile");

function splitFile(filePath, blocksIdentifiers) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const blockSize = Math.ceil(data.length / blocksIdentifiers.length);
        const destinationFolder = createDestinationFolder(
          filePath,
          "../../repositories/filesBlocks/",
        );
        const fileNames = createFileBlocks(
          data,
          blockSize,
          blocksIdentifiers,
          destinationFolder,
        );
        resolve(fileNames);
      }
    });
  });
}

function createFileBlocks(
  data,
  blockSize,
  blocksIdentifiers,
  destinationFolder,
) {
  let start = 0;
  const fileNames = [];

  blocksIdentifiers
    .sort((a, b) => a.turn - b.turn)
    .forEach((blockIdentifier, i) => {
      const end = Math.min(start + blockSize, data.length);
      const block = data.slice(start, end);
      const fileName = blockIdentifier.blockIdentifier;
      const filePath = path.join(destinationFolder, fileName);

      writeFile(filePath, block)

      fileNames.push(filePath);
      start = end;
    });

  return fileNames;
}

module.exports = splitFile;
