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
	saveFileName
} = require("../repositories/db");
const { HearBeat } = require('../repositories/grpc/client/SyncDataNodes');

const createAndSaveFileIdentifier = () => {
	const fileIdentifier = uuidv4();
	saveFileIdentifier(fileIdentifier);

	return fileIdentifier;
};

const saveDatanodeInFileMetadata = (fileIdentifier, datanodeIP) => {
	saveDatanode(fileIdentifier, datanodeIP);
};

const createAndSaveFileBlock = (fileIdentifier, datanodeIP, turn) => {
	const blockIdentifier = `${fileIdentifier}-${turn}`;
	saveBlock(fileIdentifier, datanodeIP, blockIdentifier, turn);
};

const createAndSaveFileMapper = (fileSize, fileName) => {
	const fileIdentifier = createAndSaveFileIdentifier();
	saveFileName(fileIdentifier, fileName);
  getFileMetadata(fileIdentifier);

	const datanodesNeeded = Math.ceil((fileSize) / MAX_SIZE_MB_FOR_SPLIT);
	const availableDatanodesIp = getDatanodesIp();
	console.log("datanodesNeeded", datanodesNeeded);
	console.log("availableDatanodesIp", availableDatanodesIp);
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



const runHeartBeat = () => {
	try {
		const datanodesIp = getDatanodesIp();
		
		Promise.all(datanodesIp.map(async (datanodeIp) => {
			const response = await HearBeat(datanodeIp);
			console.log("Response from HeartBeat:", response);
		}));
		
	} catch (error) {
		console.error("Error in runHeartBeat", error);
	}
}

const dataNodeLogin = (dataNodeIp) => {
	const datanodesIp = getDatanodesIp();
	if (!datanodesIp.includes(dataNodeIp)) {
		datanodesIp.push(dataNodeIp);
	}
}

module.exports = {
  createAndSaveFileMapper,
  getFileMetadata,
	runHeartBeat
}