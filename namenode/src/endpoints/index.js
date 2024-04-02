const { Router } = require("express");
const router = Router();
const { createAndSaveFileMapper, getFileMetadata } = require("../controllers");

router.get("/", (req, res) => {
	res.send("Hello World");
});

router.get("/file", (req, res) => {
	const { fileIdentifier } = req.query;
  const fileMetadata = getFileMetadata(fileIdentifier);
	res.status(200).json(fileMetadata);
});

router.post("/write", (req, res) => {
	const { fileMbSize } = req.body;
	const fileMetadata = createAndSaveFileMapper(fileMbSize);
	res.status(201).json(fileMetadata);
});

module.exports = { router };
