module.exports.createPost = async (req, res, next) => {
  if (req.body.fullName == '') {
    req.flash("error", "Vui lòng nhập tên");
    res.redirect(`back`);
    return;
  }

  if (req.body.email == '') {
    req.flash("error", "Vui lòng email");
    res.redirect(`back`);
    return;
  }

  if (req.body.password == '') {
    req.flash("error", "Vui lòng nhập mật khẩu");
    res.redirect(`back`);
    return;
  }

  next();
}

module.exports.editPatch = async (req, res, next) => {
  if (req.body.fullName == '') {
    req.flash("error", "Vui lòng nhập tên");
    res.redirect(`back`);
    return;
  }

  if (req.body.email == '') {
    req.flash("error", "Vui lòng email");
    res.redirect(`back`);
    return;
  }

  next();
}