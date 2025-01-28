const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/products-category.controller");
const multer = require('multer'); // upload file ảnh
const upload = multer(); // upload file ảnh
const validate = require("../../validates/admin/products-category.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");


router.get("/", controller.index);

router.get("/create", controller.create);
router.post("/create",
  upload.single('thumbnail'),
  uploadCloud,
  validate.createPost,
  controller.createPost
);

router.get("/edit/:id", controller.edit);
router.patch("/edit/:id",
  upload.single('thumbnail'),
  uploadCloud,
  validate.createPost,
  controller.editPacth
);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/delete/:id", controller.delete);


module.exports = router;