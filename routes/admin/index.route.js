// file chứa tất cả các route khi chúng ta gọi đến thì sẽ chạy vào
const dashboardRoute = require("./dashboard.route");
const productRoute = require("./products.route");
const productCategoryRoute = require("./products-category.route");
const roleRoute = require("./roles.route");
const accountRoute = require("./accounts.route");
const authRoute = require("./auth.route");
const myAccountRoute = require("./my-account.route");
const settingRoute = require("./setting-general.route");
const userRoute = require("./users.route");
const orderRoute = require("./orders.route");
const articleRoute = require("./article.route");


const authMiddleware = require("../../middlewares/admin/auth.middleware");

const systemConfig = require("../../configs/system");

module.exports = (app) => {
  const pathAdmin = systemConfig.PATH_ADMIN;

  app.use(pathAdmin + "/dashboard", authMiddleware.requireAuth, dashboardRoute);

  app.use(pathAdmin + "/products", authMiddleware.requireAuth, productRoute);

  app.use(pathAdmin + "/products-category", authMiddleware.requireAuth, productCategoryRoute);

  app.use(pathAdmin + "/accounts", authMiddleware.requireAuth, accountRoute);

  app.use(pathAdmin + "/roles", authMiddleware.requireAuth, roleRoute);

  app.use(pathAdmin + "/my-account", authMiddleware.requireAuth, myAccountRoute);

  app.use(pathAdmin + "/auth", authRoute);

  app.use(pathAdmin + "/settings",authMiddleware.requireAuth ,settingRoute);

  app.use(pathAdmin + "/users",authMiddleware.requireAuth ,userRoute);
  
  app.use(pathAdmin + "/orders",authMiddleware.requireAuth ,orderRoute);

  app.use(pathAdmin + "/articles",authMiddleware.requireAuth ,articleRoute);

}