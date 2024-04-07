const BLOCKS_PATH = "repositories/blocks/";

const fileManipulation = require("../useCases/fileManipulation/index");

async function getBlock(call) {
  let block = { block: {} };
  block.block[call.request.blockIdentifier] = await fileManipulation.readFile(
    `${BLOCKS_PATH}${call.request.blockIdentifier}`,
  );
  console.log("Block asked:", call.request.blockIdentifier);
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
