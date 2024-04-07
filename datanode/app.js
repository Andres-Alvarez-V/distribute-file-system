const PROTO_PATH = __dirname + "/core/proto/BlocksTransfer.proto";

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { getBlock, saveBlock } = require("./controllers/blocksControllers");

process.loadEnvFile();

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const BlocksTransfer = grpc.loadPackageDefinition(packageDefinition);
const server = new grpc.Server();

server.addService(BlocksTransfer.BlocksTransferService.service, {
  getBlock: async (call, callback) => {
    const block = await getBlock(call);
    callback(null, block);
  },
  saveBlock: async (call, callback) => {
    const success = await saveBlock(call);
    callback(null, { success });
  },
});

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
