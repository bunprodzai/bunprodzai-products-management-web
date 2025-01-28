const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const panigationHelper = require("../../helpers/pagination");
// file này dùng để tạo hàm render ra giao diện 
const Products = require("../../models/products.model");
const Account = require("../../models/accounts.model");
const systempConfig = require("../../configs/system");
const ProductsCategory = require("../../models/products-category.model");
const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/products
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  }
  // filter status
  const filterStatus = filterStatusHelper(req.query);

  if (req.query.status) {
    find.status = req.query.status;
  }

  // end filter status

  //search

  const objSearch = searchHelper(req.query);

  if (objSearch.regex) {
    find.title = objSearch.regex;
  }

  // end search

  // pagination 

  let initPagination = {
    currentPage: 1,
    limitItems: 5
  };
  const countProducts = await Products.countDocuments(find);
  const objetPagination = panigationHelper(
    initPagination,
    req.query,
    countProducts
  )

  // end pagination 

  // sort

  const initSort = {}

  if (req.query.sortKey || req.query.sortValue) {
    initSort[req.query.sortKey] = req.query.sortValue
  } else {
    initSort.position = "desc";
  }

  // end sort

  const products = await Products.find(find)
    .sort(initSort)
    .limit(objetPagination.limitItems)
    .skip(objetPagination.skip);

  for (const product of products) {
    const user = await Account.findOne({ _id: product.createBy.user_Id });
    if (user) {
      product.fullName = user.fullName;
    }


    const updatedBy = product.updatedBy[product.updatedBy.length - 1];
    if (updatedBy) {
      const userUpdated = await Account.findOne({ _id: updatedBy.user_Id });
      updatedBy.accountFullName = userUpdated.fullName;
    }
  }

  res.render("admin/pages/products/index", {
    pageTitle: "Trang Product",
    products: products,
    filterStatus: filterStatus,
    keyword: objSearch.keyword,
    pagination: objetPagination
  });
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const id = req.params.id;

    const product = await Products.findOne({
      _id: id
    });

    const updatedBy = {
      user_Id: res.locals.user.id,
      updatedAt: new Date()
    }

    if (product) {
      await Products.updateOne({
        _id: id
      }, {
        status: status,
        $push: { updatedBy: updatedBy }
      });

      req.flash("success", "Cập nhập trạng thái thành cônggg");

      res.json({
        code: 200,
        message: "Thay đổi trạng thái thành công"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Thay đổi trạng thái không thành công!!!"
    });
  }
}

// [PATCH] /admin/products/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Products.findOne({
      _id: id
    });
    const deletedBy = {
      user_Id: res.locals.user.id,
      deletedAt: new Date()
    }
    if (product) {
      await Products.updateOne({
        _id: id
      }, {
        deleted: true,
        deletedAt: new Date(),
        deletedBy: deletedBy
      });

      req.flash("success", "Xóa sản phẩm thành công");

      res.json({
        code: 200,
        message: "Xóa thành công"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Xóa không thành công!"
    });
  }
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  if (res.locals.role.permissions.includes("products_create")) {
    const ids = req.body.ids.split(", ");
    const type = req.body.type;

    const updatedBy = {
      user_Id: res.locals.user.id,
      updatedAt: new Date()
    }

    switch (type) {
      case "active":
        await Products.updateMany({
          _id: { $in: ids }
        }, {
          status: "active",
          $push: { updatedBy: updatedBy }
        });
        req.flash("success", "Cập nhập trạng thái thành công");
        break;
      case "inactive":
        await Products.updateMany({
          _id: { $in: ids }
        }, {
          status: "inactive",
          $push: { updatedBy: updatedBy }
        });
        req.flash("success", "Cập nhập trạng thái thành công");
        break;
      case "change-position":
        for (const item of ids) {
          let [id, pos] = item.split("-");
          pos = parseInt(pos);
          await Products.updateOne({
            _id: id
          }, {
            position: pos,
            $push: { updatedBy: updatedBy }
          });
        };
        req.flash("success", "Cập nhập vị trí thành công");
        break;
      default:
        break;
    }

    res.redirect("back");
  }else{
    return ;
  }
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  const find = {
    deleted: false
  }
  const categorys = await ProductsCategory.find(find);
  const newCategorys = createTreeHelper.tree(categorys);

  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
    categorys: newCategorys
  })
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  if (res.locals.role.permissions.includes("products_create")) {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position == "") {
      const countItem = await Products.countDocuments({ deleted: false });
      req.body.position = countItem + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    req.body.createBy = {
      user_Id: res.locals.user.id
    }

    const product = new Products(req.body);
    await product.save();

    req.flash("success", "Tạo mới thành công");

    res.redirect(`${systempConfig.PATH_ADMIN}/products`);
  } else {
    return;
  }
}

// [GET] /admin/products/edit
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Products.findOne({
      deleted: false,
      _id: id
    });

    const find = {
      deleted: false
    }
    const categorys = await ProductsCategory.find(find);
    const newCategorys = createTreeHelper.tree(categorys);

    res.render("admin/pages/products/edit-item", {
      pageTitle: "Thêm mới sản phẩm",
      product: product,
      categorys: newCategorys
    })
  } catch (error) {
    res.redirect(`${systempConfig.PATH_ADMIN}/products`);
  }
}

// [POST] /admin/products/edit/:id
module.exports.editPost = async (req, res) => {
  try {
    if (res.locals.role.permissions.includes("products_edit")) {
      const id = req.params.id;
      req.body.price = parseInt(req.body.price);
      req.body.discountPercentage = parseInt(req.body.discountPercentage);
      req.body.stock = parseInt(req.body.stock);


      if (req.body.position == "") {
        const countItem = await Products.countDocuments({ deleted: false });
        req.body.position = countItem + 1;
      } else {
        req.body.position = parseInt(req.body.position);
      }

      const dataEdit = req.body;

      req.flash("success", "Chỉnh sửa thành công");

      const updatedBy = {
        user_Id: res.locals.user.id,
        updatedAt: new Date()
      }

      await Products.updateOne({
        _id: id
      }, { ...dataEdit, $push: { updatedBy: updatedBy } }
      );

      res.redirect(`${systempConfig.PATH_ADMIN}/products`);
    } else {
      return;
    }
  } catch (error) {
    res.redirect(`${systempConfig.PATH_ADMIN}/products`);
  }
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Products.findOne({
      deleted: false,
      _id: id
    });
    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product
    })
  } catch (error) {
    res.redirect(`${systempConfig.PATH_ADMIN}/products`);
  }
}
