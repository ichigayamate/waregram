const express = require('express');
const ItemController = require("../controllers/item");

const router = express.Router();

router.get("/", (req, res) => {
    res.redirect("/");
});
router.get("/add", ItemController.viewAddItem);
router.post("/add", ItemController.addItem);
router.post("/finish-delivery/:id", ItemController.finishDelivery);
router.post("/delete/:id", ItemController.deleteItem);

module.exports = router;
