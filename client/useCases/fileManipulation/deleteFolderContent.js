const fs = require("fs");
const path = require("path");
const fsPromises = fs.promises;

async function deleteFolderContent(relativeFolderPath) {
  const folderPath = path.resolve(relativeFolderPath);
  const folderName = path.basename(folderPath);
  try {
    const files = await fsPromises.readdir(folderPath);
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stats = await fsPromises.stat(filePath);
      if (stats.isDirectory()) {
        await deleteFolderContent(filePath);
        await fsPromises.rmdir(filePath);
      } else {
        await fsPromises.unlink(filePath);
      }
    }
    console.log(`Contents of ${folderName} directory successfully removed`);
  } catch (err) {
    console.error(
      `An error occurred while trying to delete the contents of the ${folderName} directory:`,
      err,
    );
  }
}

module.exports = deleteFolderContent;
