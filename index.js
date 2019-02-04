const fastify = require("fastify");
const Helmet = require("fastify-helmet");
const IPFS = require("ipfs");
const config = require("./config");

let node = null;

let IPFS_READY = false;
let IPFS_VERSION = null;

const IPFS_OPTIONS = {
  EXPERIMENTAL: { pubsub: true },
  repo: "ipfs_data",
  config: {
    Addresses: {
      Swarm: [
        "/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star"
      ]
    }
  }
};

const getFile = ipfsHash => {
  return new Promise((resolve, reject) => {
    node.get(ipfsHash, (err, files) => {
      if (err) {
        reject(err);
      }
      const result = [];
      files.forEach(file => {
        const hex = file.content.toString("hex");
        result.push(hex);
      });
      if (result.length) {
        if (result.length === 1) {
          resolve(result[0]);
        } else {
          resolve(result);
        }
      }
      resolve(null);
    });
  });
};

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
  node = new IPFS(IPFS_OPTIONS);
  node.on("ready", async () => {
    const version = await node.version();
    IPFS_READY = true;
    IPFS_VERSION = version.version;
  });
});

server.listen(config.port, error => {
  if (error) {
  }
});
