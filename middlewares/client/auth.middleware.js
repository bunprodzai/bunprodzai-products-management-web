const User = require("../../models/users.model");

module.exports.requireAuth = async (req, res, next) => {
  const tokenUser = req.cookies.tokenUser;
  if (!tokenUser) {
    res.redirect(`login`);
    return;
  } else {
    const user = await User.findOne({ tokenUser: tokenUser }).select("-password");
    if (!user) {
      res.redirect(`login`);
      return;
    } else {
      res.locals.user = user;
      next();
    }
  }
}