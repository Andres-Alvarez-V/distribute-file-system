const PROTO_PATH = __dirname + "/grpc/Protobuf/BlocksTransfer.proto";

process.loadEnvFile();

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
// const { getBlock, saveBlock } = require("./controllers/blocksControllers");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const BlocksTransfer = grpc.loadPackageDefinition(packageDefinition);
const server = new grpc.Server();

server.addService(BlocksTransfer.BlocksTransferService.service, {
  getBlock: (call, callback) => {
    // const block = getBlock(call.request);
    // callback(null, { block });

    const flatBlocks = fileSystem.blocks.flat();

    const blockMap = {};
    flatBlocks.forEach((block) => {
      blockMap[block.blockIdentifier] = block;
    });

    const search = call.request.blocksIdentifiers.map(
      (blockIdentifier) => blockMap[blockIdentifier],
    );
    console.log("Response to send to client from getBlock", search);

    const block = fileSystem.blocks[call.request.blockIdentifier];
    callback(null, { block });
  },
  saveBlock: (call, callback) => {
    // const success = saveBlock(call.request);
    // callback(null, { success });
    fileSystem.blocks.push(call.request.blocks);
    console.log("fileSystem.blocks", fileSystem.blocks);
    callback(null, { success: true });
  },
});

const fileSystem = {
  blocks: [],
};

server.bindAsync(
  process.env.DATANODE_ADDRESS,
  grpc.ServerCredentials.createInsecure(),
  (err) => {
    if (err) {
      console.error(`DataNode Server failed to start: ${err}`);
      return;
    }
    server.start();
    console.log(`DataNode Server running at ${process.env.DATANODE_ADDRESS}`);
  },
);
