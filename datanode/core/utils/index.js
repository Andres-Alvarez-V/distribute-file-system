const os = require("os");
const getIpAddress = () => {
    const ifaces = os.networkInterfaces();
    let ipAddress = null;
    
    Object.keys(ifaces).forEach((ifname) => {
      ifaces[ifname].forEach((iface) => {
        if (iface.family === 'IPv4' && !iface.internal) {
          ipAddress = iface.address;
        }
      });
    });

    return ipAddress;
}

module.exports = { getIpAddress };