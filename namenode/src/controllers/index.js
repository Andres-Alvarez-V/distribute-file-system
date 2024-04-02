const { v4: uuidv4 } = require('uuid')
const { MAX_SIZE_MB_FOR_SPLIT } = require("../utils/constants");
const {
	saveFileIdentifier,
	saveDatanode,
	saveBlock,
	getDatanodesIter,
	getDatanodesIp,
	saveDatanodesIter,
  getFileMetadata: getFileMetadataRepository,
} = require("../repositories/db");

const createAndSaveFileIdentifier = () => {
	const fileIdentifier = uuidv4();
	saveFileIdentifier(fileIdentifier);

	return fileIdentifier;
};

const saveDatanodeInFileMetadata = (fileIdentifier, datanodeIP) => {
	saveDatanode(fileIdentifier, datanodeIP);
};

const createAndSaveFileBlock = (fileIdentifier, datanodeIP, turno) => {
	const blockIdentifier = `${fileIdentifier}-${turno}`;
	saveBlock(fileIdentifier, datanodeIP, blockIdentifier, turno);
};

const createAndSaveFileMapper = (fileSize) => {
	const fileIdentifier = createAndSaveFileIdentifier();
  getFileMetadata(fileIdentifier);

	const datanodesNeeded =
		(fileSize + MAX_SIZE_MB_FOR_SPLIT - 1) / MAX_SIZE_MB_FOR_SPLIT;
	const availableDatanodesIp = getDatanodesIp();
	const availableDatanodesIpQuantity = availableDatanodesIp.length;
	const datanodesIter = getDatanodesIter();

	for (let i = 0; i < datanodesNeeded; i += 1) {
		const j = (datanodesIter + i) % availableDatanodesIpQuantity;
		saveDatanodeInFileMetadata(fileIdentifier, availableDatanodesIp[j]);
		createAndSaveFileBlock(fileIdentifier, availableDatanodesIp[j], i);
	}

	const newDatanodesIter =
		(datanodesIter + datanodesNeeded) % availableDatanodesIpQuantity;
	saveDatanodesIter(newDatanodesIter);
  const fileMetadata = getFileMetadata (fileIdentifier);
  return fileMetadata;
};

const getFileMetadata = (fileIdentifier) => {
  return getFileMetadataRepository(fileIdentifier);
}
module.exports = {
  createAndSaveFileMapper,
  getFileMetadata
}