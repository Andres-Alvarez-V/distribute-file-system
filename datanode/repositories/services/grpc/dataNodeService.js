const PROTO_PATH = __dirname + "/../../../core/proto/BlocksTransfer.proto";

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

const writeBlockDataNode = async (dataNodeIp, block, blockIdentifier) => {
  const client = new BlocksTransferService(
    dataNodeIp,
    grpc.credentials.createInsecure()
  );
  try {
    const response = await new Promise((resolve, reject) => {
      client.SaveBlock({ blocks: { [blockIdentifier]: block } }, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
    console.log(`Block sent to DataNode ${dataNodeIp}: `, response);
  } catch (error) {
    
  }
}

module.exports = {
  writeBlockDataNode
};
