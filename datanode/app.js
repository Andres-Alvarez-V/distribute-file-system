const BLOCKS_TRANSFER_PROTO_PATH = __dirname + "/core/proto/BlocksTransfer.proto";
const SYNC_DATA_NODES_PROTO_PATH = __dirname + "/core/proto/SyncDataNodes.proto";

process.loadEnvFile();

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { getBlock, saveBlock } = require("./controllers/blocksControllers");
const { login } = require("./controllers/loginController");
const { syncNodeBlock } = require("./controllers/syncDataNodes");
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
    console.log("HeartBeat call");
    callback();
  },

  syncNodeBlock: async (call, callback) => {
    console.log("SyncNodeBlock call");
    const { nodeToSyncIP, blockIdentifier } = call.request;
    if (!nodeToSyncIP || !blockIdentifier) {
      callback(new Error("Invalid parameters"));
      return;
    } 
    await syncNodeBlock(nodeToSyncIP, blockIdentifier);
    callback();
  }
});

server.addService(BlocksTransfer.BlocksTransferService.service, {
  getBlock: async (call, callback) => {
    const block = await getBlock(call.request.blockIdentifier);
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
  async (err) => {
    if (err) {
      console.error(`DataNode Server failed to start: ${err}`);
      return;
    }
    await login(process.env.DATANODE_ADDRESS)

    console.log(`DataNode Server running at ${process.env.DATANODE_ADDRESS}`);
    
  },
);
