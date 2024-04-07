const BLOCKS_TRANSFER_PROTO_PATH = __dirname + "/core/proto/BlocksTransfer.proto";
const SYNC_DATA_NODES_PROTO_PATH = __dirname + "/core/proto/SyncDataNodes.proto";

process.loadEnvFile();

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { getBlock, saveBlock } = require("./controllers/blocksControllers");
process.loadEnvFile();

const blockTransferPackageDefinition = protoLoader.loadSync(BLOCKS_TRANSFER_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});
const syncDataNodesPackageDefinition = protoLoader.loadSync(SYNC_DATA_NODES_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const BlocksTransfer = grpc.loadPackageDefinition(blockTransferPackageDefinition);
const SyncDataNodes = grpc.loadPackageDefinition(syncDataNodesPackageDefinition);
const server = new grpc.Server();

server.addService(SyncDataNodes.SyncDataNodesService.service, {
  heartBeat: (call, callback) => {
    console.log("HeartBeat from", call);
    throw new Error("Not implemented");
    callback();
  },

  syncNodeBlock: (call, callback) => {
    console.log("SyncNodeBlock from", call.request);
    callback();
  }
});

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
