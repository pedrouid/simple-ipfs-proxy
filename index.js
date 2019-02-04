const fastify = require("fastify");
const Helmet = require("fastify-helmet");
const config = require("./config");
const { IPFS_READY, IPFS_VERSION, initIPFS, getFile } = require("./ipfs");

const server = fastify({ logger: config.debug });

server.register(Helmet);

server.get("/hello", (req, res) => {
  res.status(200).send(`Hello World`);
});

server.get("/ipfs/:ipfsHash", async (req, res) => {
  const { ipfsHash } = req.params;
  const result = await getFile(ipfsHash);
  res.status(200).send(result);
});

server.get("/status", (req, res) => {
  res.status(200).send({
    ready: IPFS_READY,
    version: IPFS_VERSION
  });
});

server.ready(() => {
  initIPFS();
});

app.listen(config.port, error => {
  if (error) {
    return console.log("Something went wrong", error);
  }

  console.log("Server listening on port", config.port);
});
