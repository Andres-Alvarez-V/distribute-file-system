const PROTO_PATH = __dirname + "/Protobuf/BlocksTransfer.proto";

process.loadEnvFile();

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const BlocksTransferService =
  grpc.loadPackageDefinition(packageDefinition).BlocksTransferService;
const client = new BlocksTransferService(
  process.env.DATANODE_ADDRESS,
  grpc.credentials.createInsecure(),
);

module.exports = {
  getBlock: async (blocksIdentifiers) => {
    return new Promise((resolve, reject) => {
      client.getBlock(blocksIdentifiers, (err, response) => {
        if (err) {
          console.error("BlocksTransfer -> Error", err);
          reject(err);
          return;
        }
        resolve(response);
      });
    });
  },
  saveBlock: async (blocks) => {
    return new Promise((resolve, reject) => {
      client.saveBlock(blocks, (err, response) => {
        if (err) {
          console.error("BlocksTransfer -> Error", err);
          reject(err);
          return;
        }
        resolve(response);
      });
    });
  },
};
