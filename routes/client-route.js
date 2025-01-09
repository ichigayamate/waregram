const express = require('express');
const LoginController = require("../controllers/login");
const IndexController = require("../controllers");
const router = express.Router();

router.get("/", IndexController.viewIndex);
router.get("/logout", LoginController.logout);
router.use("/login", require("./login"));

module.exports = router;
