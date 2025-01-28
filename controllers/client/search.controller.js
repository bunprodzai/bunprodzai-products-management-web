const Product = require("../../models/products.model");

const searchHelper = require("../../helpers/search");
const productsHelper = require("../../helpers/products");

module.exports.index = async (req, res) => {
  try {
    const keyword = req.query.keyword;

    let find = {
      deleted: false,
      status: "active"
    }

    if (keyword) {
      const objSearch = searchHelper(req.query);
      if (objSearch.regex) {
        find.title = objSearch.regex;
      }
    }

    const records = await Product.find(find);

    const newRecords = productsHelper.priceNewProducts(records);

    res.render("client/pages/search/index", {
      pageTitle: "Kết quả tìm kiếm",
      keyword: keyword,
      records: newRecords
    });
  } catch (error) {
    
  }
}