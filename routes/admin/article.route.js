const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/article.controller");

const multer = require('multer'); // upload file ảnh
const upload = multer(); // upload file ảnh
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const validate = require("../../validates/admin/product.validate");

router.get("/", controller.index);

router.get("/create", controller.create);
router.post("/create", upload.single('thumbnail'), uploadCloud, validate.createPost, controller.createPost);

router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", upload.single('thumbnail'), uploadCloud, controller.editPatch);

router.get("/detail/:id", controller.detail);

router.patch("/delete/:id", controller.delete);

module.exports = router;