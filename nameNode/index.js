const express = require("express");
const app = express();

const PORT = 3002;

const tokenGenerator = () => {
  return crypto.randomUUID();
};

const data = [
  [
    `${tokenGenerator()}-block`,
    `${tokenGenerator()}-datanode`,
    tokenGenerator(),
  ],
  [
    `${tokenGenerator()}-block`,
    `${tokenGenerator()}-datanode`,
    tokenGenerator(),
  ],
  [
    `${tokenGenerator()}-block`,
    `${tokenGenerator()}-datanode`,
    tokenGenerator(),
  ],
];

app.use(express.json());

app.get("/api/files/:fileIdentifier", (req, res) => {
  res.json(data);
});

app.post("/api/files/write", (req, res) => {
  // const { fileSize } = req.body;
  const block = `${tokenGenerator()}-block`;
  const datanode = `${tokenGenerator()}-datanode`;
  const token = tokenGenerator();
  data.push([block, datanode, token]);
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`NameNode Server running on port ${PORT}`);
});
