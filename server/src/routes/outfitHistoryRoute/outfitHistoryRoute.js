const express = require("express");
const router = express.Router();
const outfitHistoryController = require("../../controller/outfitHistory/outfitHistoryController");

router.post("/outfit-histories", outfitHistoryController.createOutfitHistory);
router.delete("/outfit-histories/:id", outfitHistoryController.deleteOutfitHistory);
router.get("/outfit-histories/:user_id", outfitHistoryController.getOutfitHistory);

module.exports = router;