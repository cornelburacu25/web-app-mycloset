const express = require("express");
const multer = require("multer");
const router = express.Router();
const uploadImageController = require("../../controller/image/uploadImage");

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Store route for uploading images
router.post(
  "/upload",
  upload.single("image"),
  uploadImageController.uploadToImgur
);

module.exports = router;
