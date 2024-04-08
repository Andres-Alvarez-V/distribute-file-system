const { Router } = require("express");
const router = Router();
const { createAndSaveFileMapper, getFileMetadata, runHeartBeat, dataNodeLogin } = require("../controllers");
const { SyncNodeBlock } = require("../repositories/grpc/client/SyncDataNodes");

router.get("/", async (req, res) => {
	res.send("Hello World");
});

router.get("/file", (req, res) => {
	console.log("GET /file");
	const { fileIdentifier } = req.query;
  const fileMetadata = getFileMetadata(fileIdentifier);
	res.status(200).json(fileMetadata);
});

router.post("/write", (req, res) => {
	console.log("POST /write");
	const { fileMbSize, fileName } = req.body;
	const fileMetadata = createAndSaveFileMapper(fileMbSize, fileName);
	res.status(201).json(fileMetadata);
});

router.post("/runHeartBeat", async (req, res) => {
	console.log("POST /runHeartBeat");
	await runHeartBeat();
	res.status(200).json({ message: "Heartbeat received" });
});

router.post("/datanodeLogin", (req, res) => {
	console.log("POST /datanodeLogin");
	try {
		const { datanodeAddress } = req.body;
		dataNodeLogin(datanodeAddress);
		res.status(200).json({ message: "Datanode logged in" });
	} catch (error) {
		res.status(500).json({ message: "Error in datanodeLogin" });
	}
});

module.exports = { router };
