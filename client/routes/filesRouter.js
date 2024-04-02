const filesController = require("../controllers/filesController");
const filesRouter = require("express").Router();

filesRouter.get("/file", (request, response) => {
  filesController.getFiles(request, response);
});

filesRouter.post("/write", (request, response) => {
  filesController.postFiles(request, response);
});

module.exports = filesRouter;
