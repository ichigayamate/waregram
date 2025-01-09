const express = require('express');
const LoginController = require("../controllers/login");
const router = express.Router();

router.get("/", LoginController.viewLogin);
router.post("/", LoginController.login);

module.exports = router;
