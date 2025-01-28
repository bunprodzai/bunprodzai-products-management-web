const Product = require("../../models/products.model");
const Article = require("../../models/acticles.model");
const productsHelper = require("../../helpers/products");


module.exports.home = async (req, res) => {

  const products = await Product.find({
    deleted: false,
    status: "active",
    featured: "1"
  }).limit(8);

  const newFeaturedProducts = productsHelper.priceNewProducts(products);

  const productsNew = productsHelper.priceNewProducts(await Product.find({
    deleted: false,
    status: "active",
  }).sort({ position: "desc" }).limit(4));

  const articles = await Article.find({ deleted: false }).limit(4);

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    newFeaturedProducts: newFeaturedProducts,
    productsNew: productsNew,
    articles: articles,
    articleFirst: articles[0]
  });
}