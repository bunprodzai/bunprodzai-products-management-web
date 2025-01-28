const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/users.controller");

const validate = require("../../validates/admin/users.validate");
const multer = require('multer'); // upload file ảnh
const upload = multer(); // upload file ảnh
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");


router.get("/", controller.index);

router.get("/detail/:idUser", controller.detail);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.get("/edit/:idUser", upload.single('avatar'), uploadCloud, controller.edit);

router.patch("/edit/:idUser", upload.single('avatar'), uploadCloud, validate.editPatch ,controller.editPatch);

router.patch("/delete/:idUser", controller.delete);

module.exports = router;