const SettingGeneral = require("../../models/settings-general.model");

// [GET] /settings/general
module.exports.general = async (req, res) => {
  if (res.locals.role.permissions.includes("settings_general")) {
    const setting = await SettingGeneral.findOne({});
    res.render("admin/pages/settings/general", {
      pageTitle: "Trang cài đặt chung",
      setting: setting
    });
  } else {
    return;
  }
}

// [POST] /settings/general
module.exports.generalPatch = async (req, res) => {
  if (res.locals.role.permissions.includes("settings_general")) {
    
    await SettingGeneral.updateOne({
    }, req.body);

    req.flash("success", "Cập nhật thành công");
    res.redirect(`back`);
  } else {
    req.flash("error", "Bạn không có quyền này");
    res.redirect(`back`);
    return;
  }
}