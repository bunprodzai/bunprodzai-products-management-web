const Product = require("../../models/products.model");
const ProductCategory = require("../../models/products-category.model");

const productsHelper = require("../../helpers/products");
const productsCategoryHelper = require("../../helpers/products-category");

module.exports.index = async (req, res) => {

  const products = await Product.find({
    deleted: false,
    status: "active"
  })

  const newProducts = productsHelper.priceNewProducts(products);

  res.render("client/pages/products/index", {
    pageTitle: "Trang sản phẩm",
    products: newProducts
  });
}

module.exports.category = async (req, res) => {
  try {
    const slugCategory = req.params.slugCategory;

    const category = await ProductCategory.findOne({
      slug: slugCategory,
      deleted: false,
      status: "active"
    });


    const allChildren = await productsCategoryHelper.getChildrenCategory(category.id);

    const listChildrenId = allChildren.map(item => item.id);

    const products = productsHelper.priceNewProducts(await Product.find({
      deleted: false,
      status: "active",
      product_category_id: { $in: [category.id, ...listChildrenId] }
    }).sort({ position: "desc" })
    );

    res.render("client/pages/products/products-category", {
      pageTitle: category.title,
      productsCategory: products,
      category: category
    });
  } catch (error) {
    res.send("ok")
  }
}

module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slug;

    const record = await Product.findOne({
      slug: slug
    });

    if (record.product_category_id) {
      const productCategory = await ProductCategory.findOne({ _id: record.product_category_id });
      record.titleCategory = productCategory.title;
      record.slugCategory = productCategory.slug;
    }

    const newRecord = productsHelper.priceNewProduct(record);

    res.render("client/pages/products/detail", {
      pageTitle: record.title,
      record: newRecord
    });
  } catch (error) {

  }
}