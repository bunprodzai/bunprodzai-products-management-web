const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/settings.controller");


const multer = require('multer'); // upload file ảnh
const upload = multer(); // upload file ảnh
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/general", controller.general);
router.patch("/general",upload.single('logo'), uploadCloud, controller.generalPatch);

module.exports = router;