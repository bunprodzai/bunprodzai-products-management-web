// file chứa tất cả các route khi chúng ta gọi đến thì sẽ chạy vào
const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");
const checkoutRoutes = require("./checkout.route");
const userRoutes = require("./user.route");
const chatRoutes = require("./chat.route");

const middlewareCategory = require("../../middlewares/client/category.middleware");
const middlewareCart= require("../../middlewares/client/cart.middleware");
const middlewareUser= require("../../middlewares/client/user.middleware");
const middlewareSetting= require("../../middlewares/client/setting.middleware");
const authMiddleware = require("../../middlewares/client/auth.middleware");

module.exports = (app) => {
  app.use(middlewareCategory.category);
  app.use(middlewareCart.cartId);
  app.use(middlewareUser.inforUser);
  app.use(middlewareSetting.settingGeneral);
  
  app.use("", homeRoutes);
  app.use("/products", productRoutes);
  app.use("/search", searchRoutes);
  app.use("/cart", cartRoutes);
  app.use("/checkout", checkoutRoutes);
  app.use("/user", userRoutes);
  
  app.use("/chat", authMiddleware.requireAuth, chatRoutes);
}