module.exports.editPatch = async (req, res, next) => {
  if (req.body.fullName == '') {
    req.flash("error", "Vui lòng nhập tên");
    res.redirect(`back`);
    return;
  }

  if (req.body.email == '') {
    req.flash("error", "Vui lòng nhập Email");
    res.redirect(`back`);
    return;
  }

  next();
}