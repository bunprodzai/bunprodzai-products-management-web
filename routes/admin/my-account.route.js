const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/my-account.controller");
const multer = require('multer'); // upload file ảnh
const upload = multer(); // upload file ảnh
const validate = require("../../validates/admin/accounts.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");


router.get("/", controller.index);

router.get("/edit", controller.edit);
router.patch("/edit",
  upload.single('avatar'),
  uploadCloud,
  validate.editPatch,
  controller.editPatch
);

module.exports = router;