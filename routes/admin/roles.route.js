const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/roles.controller");


router.get("/", controller.index);

router.get("/create", controller.create);
router.post("/create", controller.createPost);

router.get("/detail/:id", controller.detail);
router.patch("/edit/:id", controller.editPatch);

router.get("/permissions", controller.permissions);
router.patch("/permissions", controller.permissionsPatch);

router.get("/delete/:id", controller.delete);

module.exports = router;