const fastify = require("fastify");
const Helmet = require("fastify-helmet");
const IPFS = require("ipfs");
const config = require("./config");

let node = null;
let IPFS_READY = false;
let IPFS_VERSION = null;

const app = fastify({ logger: config.debug });

app.register(Helmet);

app.get("/hello", (req, res) => {
  res.status(200).send(`Hello World`);
});

app.get("/status", async (req, res) => {
  res.status(200).send({
    ready: IPFS_READY,
    version: IPFS_VERSION
  });
});

app.ready(() => {
  node = new IPFS();
  node.on("ready", async () => {
    const version = await node.version();
    IPFS_READY = true;
    IPFS_VERSION = version.version;
  });
});

app.listen(config.port, error => {
  if (error) {
    return console.log("Something went wrong", error);
  }

  console.log("Server listening on port", config.port);
});
