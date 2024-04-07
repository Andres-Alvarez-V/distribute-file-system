const axios = require('axios');

const loginInNamenode = async (datanodeIp) => {
  try {
    await axios.post(`http://${process.env.NAME_NODE_IP}/datanodeLogin`, {
      datanodeAddress: datanodeIp
    })
  } catch (error) {
    console.error('Error in login with namenode', error);
  }
}


module.exports = {
  loginInNamenode
};