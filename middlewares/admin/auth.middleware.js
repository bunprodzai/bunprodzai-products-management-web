const systempConfig = require("../../configs/system");
const Account = require("../../models/accounts.model");
const Role = require("../../models/roles.model");

module.exports.requireAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.redirect(`${systempConfig.PATH_ADMIN}/auth/login`);
    return;
  } else {
    const user = await Account.findOne({ token: token }).select("-password");
    if (!user) {
      res.redirect(`${systempConfig.PATH_ADMIN}/auth/login`);
      return;
    } else {
      const role = await Role.findOne({_id: user.role_id}).select("permissions title");
      res.locals.role = role;
      res.locals.user = user;
      next();
    }
  }
}