const express = require('express');
const {router} = require('./endpoints');


process.loadEnvFile();

const app = express();
app.use(express.json());
app.use(router);

const PORT = process.env.NAME_NODE_PORT || 5000;
const server = app.listen(PORT, async () => {
  console.log("Namenode Server running at port %d", PORT);
});


