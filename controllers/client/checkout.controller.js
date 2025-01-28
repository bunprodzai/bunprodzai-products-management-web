const Cart = require("../../models/carts.model");
const Product = require("../../models/products.model");
const Order = require("../../models/order.model");

const productHelper = require("../../helpers/products");

// [GET] /cart
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const recordsCart = await Cart.findOne({ _id: cartId });

  if (recordsCart.products.length > 0) {
    for (const item of recordsCart.products) {
      const productId = item.product_id;

      const productInfo = await Product.findOne({ _id: productId, deleted: false, status: "active" }).select("title thumbnail price slug discountPercentage");

      productInfo.priceNew = ((productInfo.price * (100 - productInfo.discountPercentage)) / 100).toFixed(0);
      item.totalPrice = productInfo.priceNew * item.quantity;

      item.productInfo = productInfo;

    }
  }

  recordsCart.totalPriceProducts = recordsCart.products.reduce((sum, item) => item.totalPrice + sum, 0);

  res.render("client/pages/checkout/index", {
    pageTitle: "Giỏ hàng",
    recordsCart: recordsCart
  });
}

module.exports.orderPost = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;

    const recordCarts = await Cart.findOne({ _id: cartId });
    const products = [];

    for (const product of recordCarts.products) {
      const productInfo = await Product.findOne({ _id: product.product_id, deleted: false, status: "active" }).select("price discountPercentage");
      const objProducts = {
        product_id: product.product_id,
        price: productInfo.price,
        quantity: product.quantity,
        discountPercentage: productInfo.discountPercentage
      }
      products.push(objProducts)
    }

    const orderObj = {
      cart_id: cartId,
      userInfo: userInfo,
      products: products
    }

    const order = new Order(orderObj);

    await order.save();

    await Cart.updateOne({ _id: cartId }, { products: [] });

    res.redirect(`/checkout/success/${order._id}`);
  } catch (error) {

  }
}

module.exports.success = async (req, res) => {
  const orderId = req.params.orderId;

  const recordOrder = await Order.findOne({ _id: orderId });

  if (recordOrder.products.length > 0) {
    for (const item of recordOrder.products) {
      const productId = item.product_id;

      const productInfo = await Product.findOne({ _id: productId, deleted: false, status: "active" }).select("title thumbnail price discountPercentage");

      productInfo.priceNew = ((productInfo.price * (100 - productInfo.discountPercentage)) / 100).toFixed(0);
      item.totalPrice = productInfo.priceNew * item.quantity;

      item.productInfo = productInfo;

    }
  }

  recordOrder.totalPriceProducts = recordOrder.products.reduce((sum, item) => item.totalPrice + sum, 0);
  
  
  res.render("client/pages/checkout/success", {
    pageTitle: "Chi tiết thanh toán",
    recordOrder: recordOrder
  });
}