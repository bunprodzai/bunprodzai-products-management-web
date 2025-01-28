// file này dùng để tạo hàm render ra giao diện 
const Role = require("../../models/roles.model");
const systempConfig = require("../../configs/system");
const { json } = require("body-parser");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  }

  const records = await Role.find(find);

  res.render("admin/pages/roles/index", {
    pageTitle: "Trang nhóm quyền",
    records: records
  });
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Trang thêm mới phân quyền"
  });
}

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  const record = new Role(req.body);
  record.save();
  req.flash("success", "Thên mới thành công");
  res.redirect(`${systempConfig.PATH_ADMIN}/roles`);
}


// [GET] /admin/roles/edit/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const record = await Role.findOne({
      _id: id
    });

    res.render("admin/pages/roles/edit", {
      pageTitle: "Trang thêm mới phân quyền",
      record: record
    });
  } catch (error) {
    res.redirect(`${systempConfig.PATH_ADMIN}/roles`);
  }
}

// [POST] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    await Role.updateOne({
      _id: id
    }, req.body);

    req.flash("success", "Cập nhập thành công");
    res.redirect(`${systempConfig.PATH_ADMIN}/roles`);
  } catch (error) {
    req.flash("success", "Cập nhập không thành công");
    res.redirect(`${systempConfig.PATH_ADMIN}/roles`);
  }
}

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
  let find = {
    deleted: false
  }

  const records = await Role.find(find);
  res.render("admin/pages/roles/permissions", {
    pageTitle: "Trang phân quyền",
    records: records
  });
}

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
  try {
    const permissions = req.body.permissions;
    
    for (const item of permissions) {
      await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
    };
    const records = await Role.find({ deleted: false });
    res.json({
      code: 200,
      message: "Thanh cong",
      records: records
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Không thành công"
    });
  }
}

// [GET] /admin/roles/permissions
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    
    await Role.updateOne({_id: id}, {deleted: true});

    req.flash("success", "Xóa thành công");
    res.redirect(`${systempConfig.PATH_ADMIN}/roles`);
  } catch (error) {
    req.flash("error", "Xóa không thành công");
    res.redirect(`${systempConfig.PATH_ADMIN}/roles`);
  }
}