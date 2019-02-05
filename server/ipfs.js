const IPFS = require("ipfs");

let node = null;

let IPFS_READY = false;
let IPFS_VERSION = null;

const IPFS_OPTIONS = {
  EXPERIMENTAL: { pubsub: true },
  repo: "../ipfs_data/ipfs",
  config: {
    Addresses: {
      Swarm: [
        "/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star"
      ]
    }
  }
};

const initIPFS = () => {
  node = new IPFS(IPFS_OPTIONS);
  node.on("ready", async () => {
    const version = await node.version();
    IPFS_READY = true;
    IPFS_VERSION = version.version;
  });
};

const getStatus = () => ({
  ready: IPFS_READY,
  version: IPFS_VERSION
});

const getFile = ipfsHash => {
  return new Promise((resolve, reject) => {
    node.get(ipfsHash, (err, files) => {
      if (err) {
        reject(err);
      }
      const result = [];
      files.forEach(file => {
        const base64 = file.content.toString("base64");
        result.push(base64);
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

module.exports = {
  initIPFS,
  getStatus,
  getFile
};
