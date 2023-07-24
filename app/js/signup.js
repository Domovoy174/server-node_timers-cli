const express = require("express");
const { nanoid } = require("nanoid");
const router = express.Router();
const dataBase = require("./dataBase.js");
const myFunc = require("./myFunc");

router.post("/", myFunc.urlencodedParser, async (req, res) => {
  try {
    const user = {
      _id: nanoid(),
      username: req.body.username,
      password: myFunc.hash(req.body.password),
    };
    const data = await dataBase.createUserDB(req.db, user);
    if (data.acknowledged) {
      res.status(201).json({ "responseDB": "Signed up successfully!", });
    } else {
      res.status(404).json({ "responseDB": "Signed BD Error", });
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
