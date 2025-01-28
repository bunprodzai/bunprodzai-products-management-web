// file này dùng để tạo hàm render ra giao diện 
const Account = require("../../models/accounts.model");
const systempConfig = require("../../configs/system");
const md5 = require("md5");

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
  const token = req.cookies.token;
  const user = await Account.findOne({token: token});
  if (user) {
    res.redirect(`${systempConfig.PATH_ADMIN}/dashboard`);
  } else {
    res.render("admin/pages/auth/login", {
      pageTitle: "Trang đăng nhập"
    });
  }
}

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body;
  const user = await Account.findOne({
    email: email,
    deleted: false
  });
  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }

  if (user.password != md5(password)) {
    req.flash("error", "Sai mật khẩu!");
    res.redirect("back");
    return;
  }

  if (user.status != "active") {
    req.flash("error", "Tài khoản đã bị khóa!");
    res.redirect("back");
    return;
  }

  res.cookie("token", user.token);

  res.redirect(`${systempConfig.PATH_ADMIN}/dashboard`);

}

// [GET] /admin/auth/logout
module.exports.logoutPost = async (req, res) => {

  res.clearCookie("token");
  res.redirect(`${systempConfig.PATH_ADMIN}/auth/login`);
}