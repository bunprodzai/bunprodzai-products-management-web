// file này dùng để tạo hàm render ra giao diện 
const Product = require("../../models/products.model");
const ProductCategory = require("../../models/products-category.model");
const Account = require("../../models/accounts.model");
const User = require("../../models/users.model");
const Order = require("../../models/order.model");

const productHelper = require("../../helpers/products");

module.exports.dashboard = async (req, res) => {

  const orders = await Order.find();
  let sales = 0;

  for (const item of orders) {
    for (const product of item.products) {
      sales += (productHelper.priceNew(product) * product.quantity);
    }
  }

  const statictic = {
    categoryProduct: {
      total: await ProductCategory.countDocuments({ deleted: false }),
      active: await ProductCategory.countDocuments({ deleted: false, status: "active" }),
      inactive: await ProductCategory.countDocuments({ deleted: false, status: "inactive" })
    },
    product: {
      total: (await Product.countDocuments({ deleted: false })).length,
      active: await Product.countDocuments({ deleted: false, status: "active" }),
      inactive: await Product.countDocuments({ deleted: false, status: "inactive" })
    },
    account: {
      total: (await Account.countDocuments({ deleted: false })).length,
      active: await Account.countDocuments({ deleted: false, status: "active" }),
      inactive: await Account.countDocuments({ deleted: false, status: "inactive" })
    },
    user: {
      total: await User.countDocuments({ deleted: false }),
      active: await User.countDocuments({ deleted: false, status: "active" }),
      inactive: await User.countDocuments({ deleted: false, status: "inactive" })
    },
    order: {
      total: await Order.countDocuments(),
      sales: sales
    }
  }

  // console.log(statictic.order);


  res.render("admin/pages/dashboard/index", {
    pageTitle: "Trang dashboard",
    statictic: statictic
  });
}