const express = require('express');
const UserController = require("../controllers/user");
const router = express.Router();

router.get("/", UserController.viewAllUser);
router.get("/add", UserController.viewAddUser);
router.post("/add", UserController.addUser);
router.get("/edit/:id", UserController.viewEditUser);
router.post("/edit/:id", UserController.editUser);
router.post("/delete/:id", UserController.deleteUser);

module.exports = router;
