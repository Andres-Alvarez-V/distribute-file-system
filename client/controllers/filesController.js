const nameNodeService = require("../services/nameNodeService");
const blocksTransferClient = require("../useCases/grpc/BlocksTransferClient");
const fileExists = require("../utils/fileExists");
const getFileMbSize = require("../utils/getFileMbSize");

async function getFiles(request, response) {
  try {
    const fileIdentifier = request.query.fileIdentifier;
    const blocksInfo = await nameNodeService.getFiles(fileIdentifier);
    await dataNodesConnection(blocksInfo, "read");
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
    const fileMbSize = 9; //getFileMbSize(filePath);
    const blocksInfo = await nameNodeService.postFiles(fileMbSize);
    await dataNodesConnection(blocksInfo, "write");
    response.json(blocksInfo);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}

async function dataNodesConnection(blocksInfo, action) {
  await Promise.all(
    blocksInfo.datanodes.map((dataNode) => dataNodeService[action](dataNode)),
  );
}

const dataNodeService = {
  async read(dataNode) {
    const dataNodeAddress = "localhost:3004"; //dataNode.datanodeIP;
    const blocksIdentifiers = {
      blocksIdentifiers: dataNode.blocks.map(block => block.blockIdentifier),
    };
    console.log(blocksIdentifiers);
    const response = await blocksTransferClient.getBlock(
      dataNodeAddress,
      blocksIdentifiers,
    );
    console.log("DataNode read response", response);
  },
  async write(dataNode) {
    const dataNodeAddress = "localhost:3004"; //dataNode.datanodeIP;
    const blocks = { blocks: dataNode.blocks };
    const response = await blocksTransferClient.saveBlock(
      dataNodeAddress,
      blocks,
    );
    console.log("DataNode write response", response);
  },
};

module.exports = {
  getFiles,
  postFiles,
};
