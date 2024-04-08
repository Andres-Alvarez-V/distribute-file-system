const PROTO_PATH = __dirname + "/../SyncDataNodes.proto";

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
	keepCase: true,
	longs: String,
	enums: String,
	arrays: true,
});

const SyncDataNodesService =
	grpc.loadPackageDefinition(packageDefinition).SyncDataNodesService;
const HearBeat = async (dataNodeIp) => {
	const client = new SyncDataNodesService(
		dataNodeIp,
		grpc.credentials.createInsecure()
	);

	try {
		const response = await new Promise((resolve, reject) => {
			client.heartBeat({},{ deadline: Date.now() + 3000 }, (err, response) => {
				if (err) {
					reject(err);
				} else {
					resolve(response);
				}
			});
		});
		return response;
	} catch (error) {
		// Manejar errores aquí
		console.error("Error en HeartBeat:", error.message);
		throw error; // Lanza el error para que sea manejado por código externo si es necesario
	}
};


const SyncNodeBlock = async (dataNodeIp, dataNodeIpToSync, fileIdentifier) => {
	const client = new SyncDataNodesService(
		dataNodeIp,
		grpc.credentials.createInsecure()
	);

	try {
		const response = await new Promise((resolve, reject) => {
			client.syncNodeBlock({ nodeToSyncIP: dataNodeIpToSync, blockIdentifier: fileIdentifier }, (err, response) => {
				if (err) {
					reject(err);
				} else {
					resolve(response);
				}
			});
		});

		console.log(`Block ${fileIdentifier} sent to DataNode ${dataNodeIpToSync} from DataNode ${dataNodeIp}`);
		return response;
	} catch (error) {
		// Manejar errores aquí
		console.error("Error en SyncNodeBlock:", error);
		// Obtener el código de estado del error
		const statusCode = error.code;
		console.log("Código de estado:", statusCode);
	}
}

module.exports = {
	HearBeat,
	SyncNodeBlock
};
