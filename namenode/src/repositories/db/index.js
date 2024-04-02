let datanodesIter = 0;
const datanodesIP = ['1','2','3'];
// fileIdentifier -> datanode -> [{ blockIdentifier  | numero de turno}, ....]
/*
{ 
  fileIdentifier: {
    id: 'zz',
    datanodes: [
      {
        datanodesIP: 'XXX.XXX.XXX.XXX',
        blocks: [
          { blockIdentifier: 'zz-1', turno: 1 },
          { blockIdentifier: 'zz-2', turno: 2 }
        ]
      },
      {
        datanodesIP: 'XXX.XXX.XXX.XXX',
        blocks: [
          { blockIdentifier: 'zz-1', turno: 3 },
        ]
      },
      .....
    ]
  }
}
*/
const fileMetadata = new Map();

const saveFileIdentifier = (fileIdentifier) => {
  fileMetadata.set(fileIdentifier, { id: fileIdentifier, datanodes: new Map() })
}

const saveDatanode = (fileIdentifier, datanodeIP) => {
  const file = fileMetadata.get(fileIdentifier)
  if(file.datanodes.has(datanodeIP)){
    return;
  }
  file.datanodes.set(datanodeIP, { datanodeIP: datanodeIP, blocks: [] })
}

const saveBlock = (fileIdentifier, datanodeIP, blockIdentifier, turno) => {
  console.log(fileIdentifier, datanodeIP, blockIdentifier, turno)
  const file = fileMetadata.get(fileIdentifier)
  const datanode = file.datanodes.get(datanodeIP)
  datanode.blocks.push({ blockIdentifier, turno })
}

const getDatanodesIp = () => {
  return datanodesIP;
}

const getDatanodesIter = () => {
  return datanodesIter;
}

const saveDatanodesIter = (newDatanodesIter) => {
  datanodesIter = newDatanodesIter
}

function getFileMetadata(fileIdentifier) {
  const fileInfo = fileMetadata.get(fileIdentifier);
  if (!fileInfo) {
      console.log("Archivo no encontrado");
      return;
  }

  const datanodes = fileInfo.datanodes;

  const jsonData = {};
  jsonData.fileIdentifier = {
      id: fileIdentifier,
      datanodes: [],
  };

  for (const [datanodeIP, datanodeInfo] of datanodes.entries()) {
      jsonData.fileIdentifier.datanodes.push({
          datanodeIP,
          blocks: datanodeInfo.blocks.map((block) => ({
              blockIdentifier: block.blockIdentifier,
              turno: block.turno,
          })),
      });
  }
  console.log(JSON.stringify(jsonData, null, 2));
  return jsonData;
}



module.exports = {
  saveFileIdentifier,
  saveDatanode,
  saveBlock,
  getDatanodesIp,
  getDatanodesIter,
  saveDatanodesIter,
  getFileMetadata
}