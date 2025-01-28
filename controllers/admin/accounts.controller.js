// file này dùng để tạo hàm render ra giao diện 
const Account = require("../../models/accounts.model");
const Role = require("../../models/roles.model");
const systempConfig = require("../../configs/system");
const md5 = require("md5");


// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  }
  const records = await Account.find(find).select("-password -token");

  for (const record of records) {
    const role = await Role.findOne({ _id: record.role_id, deleted: false });
    record.role = role;
  }
  
  res.render("admin/pages/accounts/index", {
    pageTitle: "Trang tài khoản",
    records: records
  });
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false
  }
  const roles = await Role.find(find);

  res.render("admin/pages/accounts/create", {
    pageTitle: "Trang tạo tài khoản",
    roles: roles
  });
}

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  const exitsEmail = await Account.findOne({
    deleted: false,
    email: req.body.email
  });

  if (exitsEmail) {
    req.flash("error", "Email đã tồn tại");
    res.redirect(`back`);
  } else {
    req.body.password = md5(req.body.password);

    const newAccount = new Account(req.body);
    await newAccount.save();
    req.flash("success", "Thêm mới thành công");
    res.redirect(`${systempConfig.PATH_ADMIN}/accounts`);
  }
}

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  const id = req.params.id;
  let find = {
    deleted: false
  }
  const roles = await Role.find(find);
  const account = await Account.findOne({ _id: id });

  res.render("admin/pages/accounts/edit", {
    pageTitle: "Trang tạo tài khoản",
    roles: roles,
    account: account
  });
}

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  const exitsEmail = await Account.findOne({
    _id: { $ne: id },
    deleted: false,
    email: req.body.email
  });

  if (exitsEmail) {
    req.flash("error", "Email đã tồn tại");
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }
    await Account.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhập thành công");
  }
  res.redirect(`back`);
}

// [PATCH] /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const id = req.params.id;

    const account = await Account.findOne({
      _id: id
    });

    if (account) {
      await Account.updateOne({
        _id: id
      }, {
        status: status
      });

      req.flash("success", "Cập nhập trạng thái thành cônggg");

      res.json({
        code: 200,
        message: "Thay đổi trạng thái thành công"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Thay đổi trạng thái không thành công!!!"
    });
  }
}

// [PATCH] /admin/accounts/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const account = await Account.findOne({
      _id: id
    });

    if (account) {
      await Account.updateOne({
        _id: id
      }, {
        deleted: true
      });

      req.flash("success", "Xóa thành công");

      res.json({
        code: 200,
        message: "Xóa thành công"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Xóa không thành công!!!"
    });
  }
}