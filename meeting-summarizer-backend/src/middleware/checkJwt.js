const express = require("express");
const checkJwt = require("../middleware/checkJwt");


const router = express.Router();

router.get("/private", checkJwt, (req, res) => {
  res.json({ message: "You accessed a protected route!", user: req.auth });
});



module.exports = checkJwt;