const User = require("../../models/users.model");
const Cart = require("../../models/carts.model");
const ForgotPassword = require("../../models/forgot-password.model");

const generateHelper = require("../../helpers/generateNumber");
const sendMailHelper = require("../../helpers/sendMail");
const md5 = require("md5")

// [GET] /user/register
module.exports.register = async (req, res) => {

  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký",
  });
}

// [POST] /user/register
module.exports.registerPost = async (req, res) => {

  const existEmail = await User.findOne({ email: req.body.email });

  if (existEmail) {
    req.flash("error", "Email đã tồn tại!");
    res.redirect("back");
    return;
  }

  req.body.password = md5(req.body.password);

  const user = new User(req.body);
  await user.save();

  res.locals.tokenUser = user.tokenUser;

  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/");

}


// [GET] /user/login
module.exports.login = async (req, res) => {

  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập",
  });
}

// [POST] /user/login
module.exports.loginPost = async (req, res) => {

  const user = await User.findOne({ email: req.body.email, deleted: false });

  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }

  if (md5(req.body.password) != user.password) {
    req.flash("error", "Sai mật khẩu");
    res.redirect("back");
    return;
  }

  if (user.status != "active") {
    req.flash("error", "Tài khoản đã bị khóa!");
    res.redirect("back");
    return;
  }

  const existUserCart = await Cart.findOne({ user_id: user.id });
  if (existUserCart) {
    res.clearCookie("cartId");
    res.cookie("cartId", existUserCart.id);
  } else {
    await Cart.updateOne({
      id: req.cookies.cartId
    }, {
      user_id: user.id
    });
  }

  res.cookie("tokenUser", user.tokenUser);

  req.flash("success", "Đăng nhập thành công");
  res.redirect("/");
}


// [GET] /user/logout
module.exports.logoutPost = async (req, res) => {

  res.clearCookie("tokenUser");
  res.clearCookie("cartId");
  req.flash("success", "Đăng xuất thành công");
  res.redirect(`/`);
}

// [GET] /user/forgot
module.exports.forgotPassword = async (req, res) => {

  res.render("client/pages/user/forgotPassword", {
    pageTitle: "Quên mật khẩu",
  });
}


module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({
    email: email,
    deleted: false,
    status: "active"
  });

  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }

  const otp = generateHelper.generateNumber(6);
  const timeExpire = 5;

  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now() + timeExpire * 60 * 1000
  }

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  // gửi opt qua email user
  const subject = "Mã OTP xách minh mật khẩu";
  const html = `
    Mã OTP để lấy lại mật khẩu của bạn là <b>${otp}</b> (sử dụng trong ${timeExpire} phút).
    Vui lòng không chia sẽ mã OTP này với bất kì ai.
  `
  sendMailHelper.sendMail(email, subject, html);

  req.flash("success", `Đã gửi mã otp qua Email: ${email}`);
  res.redirect(`/user/password/otp/${email}`);
}

// [GET] /user/otp
module.exports.optPassword = async (req, res) => {
  const email = req.params.email;
  res.render("client/pages/user/optPassword", {
    pageTitle: "Xác nhận OTP",
    email: email
  });
}

// [POST] user/password/optPassword
module.exports.optPasswordPost = async (req, res) => {
  const email = req.params.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  });

  if (!result) {
    req.flash("error", "OTP không hợp lệ!");
    res.redirect("back");
    return;
  }

  const user = await User.findOne({
    email: email
  });

  const tokenUser = user.tokenUser;
  res.cookie("tokenUser", tokenUser); // lưu cookie ở server


  req.flash("success", "Xác thực thành công");
  res.redirect("/user/password/reset-password");
}

// [GET] /user/reset-password
module.exports.resetPassword = async (req, res) => {

  res.render("client/pages/user/resetPassword", {
    pageTitle: "Đổi mật khẩu",
  });
}

// [POST] user/password/reset-password
module.exports.resetPasswordPost = async (req, res) => {
  const tokenUser = req.cookies.tokenUser;
  const password = req.body.password;
  const comfirmPassword = req.body.comfirmPassword;

  if (!password) {
    req.flash("error", "Vui lòng nhập mật khẩu");
    res.redirect("back");
    return;
  }

  if (!comfirmPassword) {
    req.flash("error", "Vui lòng nhập lại mật khẩu xác nhận");
    res.redirect("back");
    return;
  }

  if (password != comfirmPassword) {
    req.flash("error", "Mật khẩu không khớp nhau");
    res.redirect("back");
    return;
  }

  const user = await User.findOne({
    tokenUser: tokenUser
  }); // check xem có user có token không



  if (md5(password) == user.password) { // check mật khẩu cũ
    req.flash("error", "Mật khẩu mới trùng với mật khẩu cũ");
    res.redirect("back");
    return;
  }

  await User.updateOne({
    tokenUser: tokenUser
  }, {
    password: md5(password)
  });

  req.flash("success", "Đổi mật khẩu thành công");
  res.redirect("/");
}


// [GET] /user/info
module.exports.info = async (req, res) => {

  res.render("client/pages/user/info", {
    pageTitle: "Thông tin cá nhân",
  });
}
