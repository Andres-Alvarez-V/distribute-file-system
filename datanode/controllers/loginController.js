const { loginInNamenode } = require("../repositories/services/rest/namenodeClient");

const login = async (datanodeIp) => {
  loginInNamenode(datanodeIp);
}


module.exports = {
  login
};