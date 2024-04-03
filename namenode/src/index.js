const express = require('express');
const {router} = require('./endpoints');

const app = express();
app.use(express.json());
app.use(router);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
  console.log("Namenode Server running at port %d", PORT);
});


