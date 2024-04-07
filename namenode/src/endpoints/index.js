const { Router } = require("express");
const router = Router();
const { createAndSaveFileMapper, getFileMetadata, runHeartBeat } = require("../controllers");

router.get("/", (req, res) => {
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

router.post("/runHeartBeat", (req, res) => {
	runHeartBeat();
	res.status(200).json({ message: "Heartbeat received" });
});

module.exports = { router };
