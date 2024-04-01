const axios = require("axios");

process.loadEnvFile();

const NAME_NODE_URL = process.env.NAME_NODE_URL;

async function getFiles(fileIdentifier) {
  try {
    const response = await axios.get(`${NAME_NODE_URL}${fileIdentifier}`);
    return response.data;
  } catch (error) {
    throw new Error("Error getting data from NameNode");
  }
}

async function postFiles(fileSize) {
  try {
    const response = await axios.post(`${NAME_NODE_URL}write`, { fileSize });
    return response.data;
  } catch (error) {
    throw new Error("Error posting data to NameNode");
  }
}

module.exports = {
  getFiles,
  postFiles,
};
