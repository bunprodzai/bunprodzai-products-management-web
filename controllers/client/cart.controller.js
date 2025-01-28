const Cart = require("../../models/carts.model");
const Product = require("../../models/products.model");


// [GET] /carts
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

  res.render("client/pages/cart/index", {
    pageTitle: "Giỏ hàng",
    recordsCart: recordsCart
  });
}


// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({ _id: cartId });


  const exisstProductCart = cart.products.find(item => item.product_id === productId);
  const product = await Product.findOne({ _id: productId });

  if (exisstProductCart) {
    const quantityNew = quantity + exisstProductCart.quantity;
    if (quantityNew > product.stock) {
      quantityNew = product.stock;
    }
    await Cart.updateOne({
      _id: cartId,
      'products.product_id': productId
    }, {
      $set: { 'products.$.quantity': quantityNew }
    });
  } else {
    if (quantity > product.stock) {
      quantity = product.stock;
    }

    const objCart = {
      product_id: productId,
      quantity: quantity
    }

    await Cart.updateOne({
      _id: cartId
    }, {
      $push: { products: objCart }
    });
  }

  req.flash("success", "Thêm vào giỏ hàng thành công");
  res.redirect("back");
}

// [GET] /cart/delete/:idProduct
module.exports.del = async (req, res) => {
  try {
    const productId = req.params.idProduct;
    const cartId = req.cookies.cartId;

    await Cart.updateOne({
      _id: cartId
    }, {
      $pull: { products: { product_id: productId } }
    });

    req.flash("success", "Đã xóa sản phẩm thành công")
    res.redirect(`/cart`);
  } catch (error) {

  }
}

// [GET] /cart/update/:idProduct/:quantity
module.exports.update = async (req, res) => {
  try {
    const productId = req.params.idProduct;
    const quantity = req.params.quantity;
    const cartId = req.cookies.cartId;

    const product = await Product.findOne({ _id: productId });
    // console.log(product.stock);

    if (quantity > product.stock) {
      quantity = product.stock;
      await Cart.updateOne({
        _id: cartId,
        'products.product_id': productId
      }, {
        $set: { 'products.$.quantity': quantity }
      });

      req.flash("success", "Cập nhập sản phẩm thành công");
      res.redirect(`/cart`);

    } else {
      await Cart.updateOne({
        _id: cartId,
        'products.product_id': productId
      }, {
        $set: { 'products.$.quantity': quantity }
      });

      req.flash("success", "Cập nhập sản phẩm thành công");
      res.redirect(`/cart`);
    }

  } catch (error) {
    res.redirect(`/cart`);
  }
}