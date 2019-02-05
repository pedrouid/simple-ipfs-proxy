const axios = require("axios");

const api = axios.create({
  baseURL: "https://api.pinata.cloud/",
  timeout: 30000, // 30 secs
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    pinata_api_key: process.env.PINATA_API_KEY,
    pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY
  }
});

const pinJson = fileJson => api.post("pinning/pinJSONToIPFS", fileJson);

module.exports = {
  pinJson
};
