const express = require("express");
const router = express.Router();
let {
  getPool,
  getGeneral,
} = require("../../../../../connections/api/v1/connection");

router.use("/banner", require("./banner/banner"));
router.use("", require("./systemSetup/systemSetup"));

router.get("/connection-check", async (req, res) => {
  try {
    return res.send({
      message: "Connection create success ",
      "api v": 1,
    });
  } catch (error) {
    return res.status(400).send({
      status: 404,
      message: "Connection create fail try",
      "api v": 1,
      error: error,
    });
  }
});

module.exports = router;
