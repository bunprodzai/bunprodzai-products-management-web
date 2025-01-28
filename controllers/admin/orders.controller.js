// file này dùng để tạo hàm render ra giao diện 
const Order = require("../../models/order.model");
const Product = require("../../models/products.model");
const systempConfig = require("../../configs/system");

const panigationHelper = require("../../helpers/pagination");
const productHelper = require("../../helpers/products");

// [GET] /admin/orders
module.exports.index = async (req, res) => {

  // pagination 
  let initPagination = {
    currentPage: 1,
    limitItems: 5
  };
  const countOrder = await Order.countDocuments({});
  const objetPagination = panigationHelper(
    initPagination,
    req.query,
    countOrder
  );
  // end pagination 

  let sales = 0;

  const records = await Order.find().lean().limit(objetPagination.limitItems)
  .skip(objetPagination.skip);

  for (const item of records) {
    if (item.products.length > 0) {
      let totalPrice = 0;
      let totalQuantity = 0;
      for (const product of item.products) {
        const priceNew = productHelper.priceNew(product);
        totalPrice += priceNew * product.quantity;
        totalQuantity += product.quantity;
      }
      item.totalOrder = totalPrice;
      sales += item.totalOrder;
      item.totalQuantity = totalQuantity;
    }
  }

  res.render("admin/pages/order/index", {
    pageTitle: "Quản lý đơn hàng",
    records: records,
    sales: sales,
    pagination: objetPagination
  });
}

// [GET] /admin/orders
module.exports.detail = async (req, res) => {
  const id = req.params.id;

  const record = await Order.findOne({ _id: id }).lean();
  // console.log(record);
  if (record.products.length > 0) {
    for (const item of record.products) {
      const productId = item.product_id;
      
      const productInfo = await Product.findOne({ _id: productId, deleted: false, status: "active" }).select("title");
      
      item.priceNew = productHelper.priceNew(item);
      item.totalPrice = item.priceNew * item.quantity;

      item.title = productInfo.title;
    }
  }

  record.totalPriceProducts = record.products.reduce((sum, item) => item.totalPrice + sum, 0);

  res.render("admin/pages/order/detail", {
    pageTitle: "Chi tiết đơn hàng",
    record: record
  });
}