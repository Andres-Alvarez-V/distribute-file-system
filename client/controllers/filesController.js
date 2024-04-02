const nameNodeService = require("../services/nameNodeService");
const fileExists = require("../utils/fileExists");
const getFileMbSize = require("../utils/getFileMbSize");

async function getFiles(request, response) {
  try {
    const fileIdentifier = request.query.fileIdentifier;
    const blocksInfo = await nameNodeService.getFiles(fileIdentifier);
    // Add here dataNodes connection*
    response.json(blocksInfo);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}

async function postFiles(request, response) {
  try {
    const fileName = request.body.fileName;
    const filePath = `useCases/files/${fileName}`;
    const exists = fileExists(filePath);
    if (!exists) {
      response.status(400).json({ error: "File does not exist" });
      return;
    }
    const fileMbSize = getFileMbSize(filePath);
    const blocksInfo = await nameNodeService.postFiles(fileMbSize);
    // Add here dataNodes connection*
    response.json(blocksInfo);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}

module.exports = {
  getFiles,
  postFiles,
};
