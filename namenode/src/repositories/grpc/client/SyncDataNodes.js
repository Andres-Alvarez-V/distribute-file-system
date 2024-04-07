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
			client.HeartBeat({}, (err, response) => {
				if (err) {
					reject(err);
				} else {
					resolve(response);
				}
			});
		});

		console.log("Respuesta de HeartBeat:", response);
		return response;
	} catch (error) {
		// Manejar errores aquí
		console.error("Error en HeartBeat:", error);
		// Obtener el código de estado del error
		const statusCode = error.code;
		console.log("Código de estado:", statusCode);
		// y así sucesivamente para otros códigos de estado
		throw error; // Lanza el error para que sea manejado por código externo si es necesario
	}
};

module.exports = {
	HearBeat,
};
