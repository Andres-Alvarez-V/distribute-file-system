const BLOCKS_PATH = "repositories/blocks/";

const fileManipulation = require("../useCases/fileManipulation/index");

async function getBlock(blockIdentifier) {
  let block = { block: {} };
  block.block[blockIdentifier] = await fileManipulation.readFile(
    `${BLOCKS_PATH}${blockIdentifier}`,
  );
  console.log("Block asked:", blockIdentifier);
  return block;
}

async function saveBlock(call) {
  await Object.entries(call.request.blocks).forEach(([key, value]) => {
    fileManipulation.writeFile(`${BLOCKS_PATH}${key}`, value);
  });
  console.log("Block saved:", ...Object.keys(call.request.blocks));
  return true;
}

module.exports = {
  getBlock,
  saveBlock,
};
