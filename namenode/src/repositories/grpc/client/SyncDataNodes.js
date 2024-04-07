const PROTO_PATH = __dirname + "../SyncDataNodes.proto";

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
	keepCase: true,
	longs: String,
	enums: String,
	arrays: true,
});

const SyncDataNodes =
	grpc.loadPackageDefinition(packageDefinition).SyncDataNodes;

const HearBeat = async (dataNodeIp) => {
	const client = new SyncDataNodes(
		dataNodeIp,
		grpc.credentials.createInsecure()
	);

	try {
		const response = await new Promise((resolve, reject) => {
			client.HeartBeat({}, (err, response) => {
				if (err) {
					console.error("HeartBeat", err);
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
		// Puedes comparar el código de estado con los valores de gRPC para determinar el tipo de error
		if (statusCode === grpc.status.CANCELLED) {
			console.log("La llamada RPC se canceló antes de completarse.");
		} else if (statusCode === grpc.status.DEADLINE_EXCEEDED) {
			console.log(
				"Se excedió el plazo de tiempo permitido para la llamada RPC."
			);
		}
		// y así sucesivamente para otros códigos de estado
		throw error; // Lanza el error para que sea manejado por código externo si es necesario
	}
};

module.exports = {
	HearBeat,
};
