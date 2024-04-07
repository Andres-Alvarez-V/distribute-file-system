const { Router } = require("express");
const router = Router();
const { createAndSaveFileMapper, getFileMetadata, runHeartBeat, dataNodeLogin } = require("../controllers");
const { SyncNodeBlock } = require("../repositories/grpc/client/SyncDataNodes");

router.get("/", async (req, res) => {
	try {
		await SyncNodeBlock("172.20.0.2:3000", "172.20.0.3:3001", "aee8d53f-15b1-4a28-bb25-f6d7cbfa3424-4")
	} catch (error) {
		
	}
	res.send("Hello World");
});

router.get("/file", (req, res) => {
	const { fileIdentifier } = req.query;
  const fileMetadata = getFileMetadata(fileIdentifier);
	res.status(200).json(fileMetadata);
});

router.post("/write", (req, res) => {
	const { fileMbSize, fileName } = req.body;
	const fileMetadata = createAndSaveFileMapper(fileMbSize, fileName);
	res.status(201).json(fileMetadata);
});

router.post("/runHeartBeat", async (req, res) => {
	await runHeartBeat();
	res.status(200).json({ message: "Heartbeat received" });
});

router.post("/datanodeLogin", (req, res) => {
	try {
		const { datanodeAddress } = req.body;
		dataNodeLogin(datanodeAddress);
		res.status(200).json({ message: "Datanode logged in" });
	} catch (error) {
		res.status(500).json({ message: "Error in datanodeLogin" });
	}
});

module.exports = { router };
