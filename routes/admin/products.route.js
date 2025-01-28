const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/products.controller");

const multer = require('multer'); // upload file ảnh
const upload = multer(); // upload file ảnh
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const validate = require("../../validates/admin/product.validate");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.patch("/delete/:id", controller.delete);

router.get("/create", controller.create);
router.post("/create", upload.single('thumbnail'), uploadCloud, validate.createPost, controller.createPost);

router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", upload.single('thumbnail'), uploadCloud, validate.createPost, controller.editPost);

router.get("/detail/:id", controller.detail);

module.exports = router;