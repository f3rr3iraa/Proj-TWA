const express = require("express");
const router = express.Router();

const getItems = require("../controllers/table/getItems.controller");
const getItemsUpdates = require("../controllers/table/getItemsUpdates.controller");
const sendMail = require("../controllers/table/sendMail.controller");

router.get("/items", getItems);
router.get("/items-updates", getItemsUpdates);
router.post("/send-mail", sendMail);

module.exports = router;
