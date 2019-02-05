const fastify = require("fastify");
const helmet = require("fastify-helmet");
const cors = require("fastify-cors");
const config = require("./config");
const { initIPFS, getStatus, getFile } = require("./ipfs");
const { pinJson } = require("./pinata");

const server = fastify({ logger: config.debug });

server.register(helmet);
server.register(cors);

server.get("/hello", (req, res) => {
  res.status(200).send(`Hello World`);
});

server.get("/status", (req, res) => {
  const status = getStatus();
  res.status(200).send(status);
});

server.post("/pin", async (req, res) => {
  try {
    const result = await pinJson(req.body);
    res.status(200).send({
      success: true,
      result: result.data.IpfsHash
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong"
    });
  }
});

server.get("/ipfs/:ipfsHash", async (req, res) => {
  const { ipfsHash } = req.params;
  try {
    const result = await getFile(ipfsHash);
    res.status(200).send({
      success: true,
      result: result
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong"
    });
  }
});

server.ready(() => {
  initIPFS();
});

server.listen(config.port, error => {
  if (error) {
    return console.log("Something went wrong", error);
  }

  console.log("Server listening on port", config.port);
});
