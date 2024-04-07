const axios = require("axios");

process.loadEnvFile();

const NAME_NODE_URL = process.env.NAME_NODE_URL;

async function getFiles(fileIdentifier) {
  try {
    const response = await axios.get(
      `${NAME_NODE_URL}file?fileIdentifier=${fileIdentifier}`,
    );
    console.log("\nNameNode getFiles response:", response.data, "\n");
    return response.data;
  } catch (error) {
    throw new Error("Error getting data from NameNode");
  }
}

async function postFiles(fileMbSize, fileName) {
  try {
    const response = await axios.post(`${NAME_NODE_URL}write`, { fileMbSize, fileName });
    console.log("\nNameNode postFiles response:", response.data, "\n");
    return response.data;
  } catch (error) {
    throw new Error("Error posting data to NameNode");
  }
}

module.exports = {
  getFiles,
  postFiles,
};
