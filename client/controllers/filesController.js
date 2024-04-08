const FILE_SYSTEM_PATH = "repositories/fileSystem/";
const FILES_BLOCKS_PATH = "repositories/filesBlocks/";

const nameNodeService = require("../repositories/services/nameNodeService");
const dataNodeService = require("../repositories/services/dataNodeService");
const fileManipulation = require("../useCases/fileManipulation/index");
const fileExists = require("../core/utils/fileExists");
const getFileMbSize = require("../core/utils/getFileMbSize");

async function getFiles(request, response) {
  try {
    const fileIdentifier = request.query.fileIdentifier;
    const blocksInfo = await nameNodeService.getFiles(fileIdentifier);
    const blocksData = await dataNodeService.readDataNode(blocksInfo);
    const formattedData = await formatData(blocksInfo, blocksData);
    const downloadedFilePath = await fileManipulation.joinFile(
      `${FILE_SYSTEM_PATH}${blocksInfo.fileName || "downloadedFile.mp3"}`,
      formattedData.contentFile,
      formattedData.turns,
    );
    response.json({
      message: `The file has been downloaded on ${downloadedFilePath}`,
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}

async function postFiles(request, response) {
  try {
    const fileName = request.body.fileName;
    const filePath = `repositories/fileSystem/${fileName}`;
    const exists = fileExists(filePath);
    if (!exists) {
      response.status(400).json({ error: "File does not exist" });
      return;
    }
    const fileMbSize = getFileMbSize(filePath);
    const blocksInfo = await nameNodeService.postFiles(fileMbSize, fileName);
    const blocks = await manageFilesBlocks(blocksInfo, filePath);
    fileManipulation.deleteFolderContent(FILES_BLOCKS_PATH)
    await dataNodeService.writeDataNode(blocksInfo, blocks);
    response.json({
      message: `The file ${
        blocksInfo.fileName ? blocksInfo.fileName + " " : ""
      }has been uploaded`,
      idFile: blocksInfo.id,
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}

async function manageFilesBlocks(blocksInfo, filePath) {
  const blockIdentifiers = blocksInfo.datanodes
    .map((datanode) => datanode.blocks)
    .flat();
  const fileBlocksPath = await fileManipulation.splitFile(
    filePath,
    blockIdentifiers,
  );
  const blocksPromises = fileBlocksPath.map(async (blockPath) => {
    const block = await fileManipulation.readFile(blockPath);
    return block;
  });

  const blocks = await Promise.all(blocksPromises);

  return blocks;
}

async function formatData(blocksInfo, blocksData) {
  const turns = blocksInfo.datanodes.flatMap((datanode) =>
    datanode.blocks.map((block) => {
      return { [block.turn]: block.blockIdentifier };
    }),
  );

  const contentFile = blocksData
    .flat()
    .map((block) => {
      return block.block;
    })
    .reduce((acc, curr) => {
      const [key] = Object.keys(curr);
      const value = curr[key];
      acc[key] = value;
      return acc;
    }, {});

  return { turns, contentFile };
}

module.exports = {
  getFiles,
  postFiles,
};
