module.exports.forgotPasswordPost = async (req, res, next) => {

  if (req.body.email == '') {
    req.flash("error", "Vui lòng email");
    res.redirect(`back`);
    return;
  }
  next();
}

module.exports.resetPasswordPost = async (req, res, next) => {

  if (req.body.password == '') {
    req.flash("error", "Vui lòng nhập mật khẩu");
    res.redirect(`back`);
    return;
  }

  if (req.body.comfirmPassword == '') {
    req.flash("error", "Vui lòng nhập mật khẩu xác nhận");
    res.redirect(`back`);
    return;
  }


  next();
}

module.exports.optPasswordPost = async (req, res, next) => {

  if (req.body.otp == '') {
    req.flash("error", "Vui lòng nhập OTP");
    res.redirect(`back`);
    return;
  }



  next();
}