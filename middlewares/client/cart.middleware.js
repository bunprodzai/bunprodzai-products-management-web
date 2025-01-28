const Cart = require("../../models/carts.model");
const User = require("../../models/users.model");

module.exports.cartId = async (req, res, next) => {
  const cartId = req.cookies.cartId;
  const tokenUser = req.cookies.tokenUser;

  const existUser = await User.findOne({ tokenUser: tokenUser });
  
  if (existUser) {
    // nếu có user đã đăng nhập
    try {
      const cart = await Cart.findOne({ _id: cartId });
      await Cart.updateOne({_id: cartId}, {user_id: existUser._id});
      cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
      res.locals.totalProductsInCart = cart.products.length;
      res.locals.miniCarts = cart;
    } catch (error) {
      console.log(error);
    }
  } else {
    if (!cartId) {
      // Nếu chưa có giỏ hàng thì tạo mới giỏ hàng
      const cart = new Cart();
      await cart.save();
      const expriesCookie = 60 * 60 * 1000; // 1 giờ
      res.cookie("cartId", cart._id, {
        expries: new Date(Date.now() + (expriesCookie * 48))
      });

    } else {
      try {
        const cart = await Cart.findOne({ _id: cartId });
        cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
        res.locals.totalProductsInCart = cart.products.length;
        res.locals.miniCarts = cart;
      } catch (error) {
        console.log(error);
      }
    }
  }
  next();
}