const splitFile = require("./splitFile");
const joinFile = require("./joinFile");
const readFile = require("./readFile");
const deleteFolderContent = require("./deleteFolderContent");
const { writeFile, createDestinationFolder } = require("./writeFile");

module.exports = {
  splitFile,
  joinFile,
  readFile,
  writeFile,
  createDestinationFolder,
  deleteFolderContent,
};
