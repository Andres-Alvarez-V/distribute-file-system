let datanodesIter = 0;
const datanodesIP = [];
// fileIdentifier -> datanode -> [{ blockIdentifier  | numero de turno}, ....]
/*
{ 
  fileIdentifier: {
    id: 'zz',
    fileName: 'zz.txt',
    datanodes: [
      {
        datanodeIP: 'XXX.XXX.XXX.XXX',
        blocks: [
          { blockIdentifier: 'zz-1', turn: 1 },
          { blockIdentifier: 'zz-2', turn: 2 }
        ]
      },
      {
        datanodeIP: 'XXX.XXX.XXX.XXX',
        blocks: [
          { blockIdentifier: 'zz-1', turn: 3 },
        ]
      },
      .....
    ]
  }
}
*/
const fileMetadata = new Map();

const saveFileIdentifier = (fileIdentifier) => {
	fileMetadata.set(fileIdentifier, {
		id: fileIdentifier,
		datanodes: new Map(),
	});
};

const saveFileName = (fileIdentifier, fileName) => {
	const file = fileMetadata.get(fileIdentifier);
	file.fileName = fileName;
};

const saveDatanode = (fileIdentifier, datanodeIP) => {
	const file = fileMetadata.get(fileIdentifier);
	if (file.datanodes.has(datanodeIP)) {
		return;
	}
	file.datanodes.set(datanodeIP, { datanodeIP: datanodeIP, blocks: [] });
};

const saveBlock = (fileIdentifier, datanodeIP, blockIdentifier, turn) => {
	const file = fileMetadata.get(fileIdentifier);
	const datanode = file.datanodes.get(datanodeIP);
	datanode.blocks.push({ blockIdentifier, turn });
};

const getDatanodesIp = () => {
	return datanodesIP;
};

const addDatanodeIp = (datanodeIP) => {
	datanodesIP.push(datanodeIP);
	console.log("Datanode added:", datanodeIP);
	console.log("Datanodes:", datanodesIP);
};

const getDatanodesIter = () => {
	return datanodesIter;
};

const saveDatanodesIter = (newDatanodesIter) => {
	datanodesIter = newDatanodesIter;
};

function getFileMetadata(fileIdentifier) {
	const fileInfo = fileMetadata.get(fileIdentifier);
	if (!fileInfo) {
		console.log("Archivo no encontrado");
		return;
	}

	const datanodes = fileInfo.datanodes;

	const jsonData = {
		id: fileIdentifier,
		fileName: fileInfo.fileName,
		datanodes: [],
	};

	for (const [datanodeIP, datanodeInfo] of datanodes.entries()) {
		jsonData.datanodes.push({
			datanodeIP,
			blocks: datanodeInfo.blocks.map((block) => ({
				blockIdentifier: block.blockIdentifier,
				turn: block.turn,
			})),
		});
	}

	return jsonData;
}

const logFilesMetadata = () => {
	const jsonDataToLog = [];
	for (const [fileIdentifier, fileInfo] of fileMetadata.entries()) {
		const jsonData = {
			fileIdentifier: fileIdentifier,
			fileName: fileInfo.fileName,
			datanodes: [],
		};
		for (const [datanodeIP, datanodeInfo] of fileInfo.datanodes.entries()) {
			jsonData.datanodes.push({
				datanodeIP,
				blocks: datanodeInfo.blocks.map((block) => ({
					blockIdentifier: block.blockIdentifier,
					turn: block.turn,
				})),
			});
		}
		jsonDataToLog.push(jsonData);
	}

	console.log(JSON.stringify(jsonDataToLog, null, 2));
};

const getAllFilesMetadata = () => {
	return fileMetadata;
};

const deleteDatanodes = (failedDatanodes) => {
	for (const [fileIdentifier, fileInfo] of fileMetadata.entries()) {
		for (const datanodeIP of failedDatanodes) {
			if (fileInfo.datanodes.has(datanodeIP)) {
				fileInfo.datanodes.delete(datanodeIP);
			}
		}
	}

  for (const failedDatanode of failedDatanodes) {
    const index = datanodesIP.indexOf(failedDatanode);
    if (index !== -1) {
      datanodesIP.splice(index, 1);
    }
  }

  console.log("Datanodes available:", datanodesIP);
};
// blocksFromFailedDatanodes = Arreglo de { blocksIdentifier | fileIdentifier } que contenian los nodos que se cayeron.
const getBlocksFromFailedDatanodes = (failedDatanodes) => {
	const blocksFromFailedDatanodes = [];
	for (const [fileIdentifier, fileInfo] of fileMetadata.entries()) {
		for (const datanodeIP of failedDatanodes) {
			if (fileInfo.datanodes.has(datanodeIP)) {
				const datanode = fileInfo.datanodes.get(datanodeIP);
				for (const block of datanode.blocks) {
					blocksFromFailedDatanodes.push({
						blocksIdentifier: block.blockIdentifier,
						fileIdentifier: fileIdentifier,
					});
				}
			}
		}
	}
	return blocksFromFailedDatanodes;
};

// * obtener arreglo de cada datanode que tiene el blockIdentifier { blocksIdentifier | datanodeIP}
const getBlocksWithDatanodeIp = (blocksFromFailedDatanodes) => {
  const blocksWithDatanodeIp = [];
  for (const [fileIdentifier, fileInfo] of fileMetadata.entries()) {
    for (const blocksFromFailedDatanode of blocksFromFailedDatanodes) {
      if (blocksFromFailedDatanode.fileIdentifier === fileIdentifier) {
        const datanode = fileInfo.datanodes;
        for (const [datanodeIP, datanodeInfo] of datanode.entries()) {
          for (const blockInfo of datanodeInfo.blocks) {
            if (blockInfo.blockIdentifier === blocksFromFailedDatanode.blocksIdentifier) {
              blocksWithDatanodeIp.push({
                blockIdentifier: blocksFromFailedDatanode.blocksIdentifier,
                datanodeIP: datanodeIP,
								fileIdentifier: fileIdentifier,
								turn: blockInfo.turn,
              });
            }
          }
        }
      }
    }
  }
  return blocksWithDatanodeIp;
};

module.exports = {
	saveFileIdentifier,
	saveDatanode,
	saveBlock,
	getDatanodesIp,
	getDatanodesIter,
	saveDatanodesIter,
	getFileMetadata,
	saveFileName,
	addDatanodeIp,
	getAllFilesMetadata,
	deleteDatanodes,
	logFilesMetadata,
  getBlocksFromFailedDatanodes,
  getBlocksWithDatanodeIp
};
