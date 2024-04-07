const { writeBlockDataNode } = require("../repositories/services/grpc/dataNodeService");
const { getBlock } = require("./blocksControllers")

const syncNodeBlock = async (datanodeIp, fileIdentifier) => {
  const block = (await getBlock(fileIdentifier)).block[fileIdentifier];
  await writeBlockDataNode(datanodeIp, block, fileIdentifier);
  console.log("Block sent:", fileIdentifier);
}

module.exports = {
  syncNodeBlock
};
