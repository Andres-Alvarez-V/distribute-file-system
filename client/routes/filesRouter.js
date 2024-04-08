const filesController = require("../controllers/filesController");
const filesRouter = require("express").Router();

filesRouter.get("/file", (request, response) => {
  try{
    filesController.getFiles(request, response);
  }catch(error){
    console.error(error);
  }
});

filesRouter.post("/write", (request, response) => {
  try{
    filesController.postFiles(request, response);
  }catch(error) {
    console.error(error);
  }
});

module.exports = filesRouter;
