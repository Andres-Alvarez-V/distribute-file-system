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

const clientCache = {};

function useClient(dataNodeAddress) {
  if (!clientCache[dataNodeAddress]) {
    clientCache[dataNodeAddress] = new BlocksTransferService(
      dataNodeAddress,
      grpc.credentials.createInsecure(),
    );
  }
  return clientCache[dataNodeAddress];
}

module.exports = {
  getBlock: async (dataNodeAddress, blocksIdentifiers) => {
    return new Promise((resolve, reject) => {
      const client = useClient(dataNodeAddress);
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
  saveBlock: async (dataNodeAddress, blocks) => {
    return new Promise((resolve, reject) => {
      const client = useClient(dataNodeAddress);
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
