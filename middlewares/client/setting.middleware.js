const SettingGeneral = require("../../models/settings-general.model");

module.exports.settingGeneral = async (req, res, next) => {

  const setting = await SettingGeneral.findOne({});

  if (setting) {
    res.locals.setting = setting;
  }

  next();
}