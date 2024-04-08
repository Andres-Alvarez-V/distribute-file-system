const blocksTransferClient = require("../../core/grpc/BlocksTransferClient");

async function writeDataNode(blocksInfo, blocks) {
  try {
    await Promise.all(
      blocksInfo.datanodes.map(async (dataNode) => {
        const blocksTurns = dataNode.blocks.map((block) => block.turn);

        const selectedBlocks = [];
        blocksTurns.forEach((turn) => {
          if (turn < blocks.length) {
            selectedBlocks.push(blocks[turn]);
          }
        });

        selectedBlocks.forEach(async (block, i) => {
          await write(dataNode, block, i);
        });
      }),
    );
  } catch (error) {
    console.error("Error writing data node:", error);
    throw error;
  }
}

async function write(dataNode, block, i) {
  const dataNodeAddress = dataNode.datanodeIP;
  let blockData = {};
  blockData[dataNode.blocks[i].blockIdentifier] = block;
  const response = await blocksTransferClient.saveBlock(dataNodeAddress, {
    blocks: blockData,
  });
  console.log("Block sent to DataNode:", response);
}

async function readDataNode(blocksInfo) {
  try {
    let blockData = await Promise.all(
      blocksInfo.datanodes.flatMap(async (dataNode) => {
        return await Promise.all(
          dataNode.blocks.map(async (block) => {
            return await read(dataNode, block.blockIdentifier);
          }),
        );
      }),
    );
    return blockData;
  } catch (error) {
    console.error("Error reading data node:", error);
    throw error;
  }
}

async function read(dataNode, blockIdentifier) {
  const dataNodeAddress = dataNode.datanodeIP;
  const response = await blocksTransferClient.getBlock(dataNodeAddress, {
    blockIdentifier,
  });
  console.log("Block read from DataNode", blockIdentifier);
  return response;
}

module.exports = {
  writeDataNode,
  readDataNode,
};
