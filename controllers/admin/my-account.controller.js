// file này dùng để tạo hàm render ra giao diện 
const Account = require("../../models/accounts.model");
const Role = require("../../models/roles.model");
const md5 = require("md5");
const systempConfig = require("../../configs/system");
// [GET] /my-account
module.exports.index = async (req, res) => {
  const id = res.locals.user.id;
  
  const myAccount = await Account.findOne({_id : id});
  const roles = await Role.find({deleted: false});
  for (const role of roles) {
    if(role._id == myAccount.role_id){
      myAccount.titleRole = role.title;
    }
  }
  res.render("admin/pages/my-account/index", {
    pageTitle: "Trang thông tin cá nhân",
    myAccount: myAccount
  });
}

// [GET] /admin/my-account/edit
module.exports.edit = async (req, res) => {
  const id = res.locals.user.id;
  
  const myAccount = await Account.findOne({_id : id});
  const roles = await Role.find({deleted: false});
  for (const role of roles) {
    if(role._id == myAccount.role_id){
      myAccount.titleRole = role.title;
    }
  }
  
  res.render("admin/pages/my-account/edit", {
    pageTitle: "Trang thông tin cá nhân",
    myAccount: myAccount,
    roles: roles
  });
}

// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
  const id = res.locals.user.id;
  
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
  res.redirect(`${systempConfig.PATH_ADMIN}/my-account`);
}