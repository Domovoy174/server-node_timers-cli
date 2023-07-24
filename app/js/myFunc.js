const crypto = require("crypto");
const express = require("express");

const urlencodedParser = express.urlencoded({
  extended: false,
});

function hash(passwordNoHash) {
  return crypto.createHash("sha256").update(passwordNoHash).digest("hex");
}

module.exports = {
  urlencodedParser,
  hash,
};
