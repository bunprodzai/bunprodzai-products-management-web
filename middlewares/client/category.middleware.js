const ProductCategory = require("../../models/products-category.model");

const createTree = require("../../helpers/createTree");

module.exports.category = async (req, res, next) => {
  const productsCategory = await ProductCategory.find({deleted: false});

  const newProductsCategory = createTree.tree(productsCategory);
  
  res.locals.layoutProductsCategory = newProductsCategory;
  next();
}