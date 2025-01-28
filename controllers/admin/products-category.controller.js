// file này dùng để tạo hàm render ra giao diện

const ProductsCategory = require("../../models/products-category.model");
const systempConfig = require("../../configs/system");
const createTreeHelper = require("../../helpers/createTree");


// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  }

  const records = await ProductsCategory.find(find);

  const newRecords = createTreeHelper.tree(records);

  res.render("admin/pages/products-category/index", {
    pageTitle: "Trang Danh Mục",
    productsCategory: newRecords
  });
}

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  const find = {
    deleted: false
  }

  const records = await ProductsCategory.find(find);

  const newRecords = createTreeHelper.tree(records);


  res.render("admin/pages/products-category/create", {
    pageTitle: "Tạo danh mục",
    records: newRecords
  });
}

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  if (res.locals.role.permissions.includes("products-category_create")) {
    if (req.body.position == "") {
      const countItem = await ProductsCategory.countDocuments({ deleted: false });
      req.body.position = countItem + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    const record = new ProductsCategory(req.body);
    await record.save();

    req.flash("success", "Tạo mới thành công");

    res.redirect(`${systempConfig.PATH_ADMIN}/products-category`);
  } else {
    return;
  }
}

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const find = {
      deleted: false
    }

    const records = await ProductsCategory.find(find);

    const newRecords = createTreeHelper.tree(records);

    const record = await ProductsCategory.findOne({
      _id: id
    });

    res.render("admin/pages/products-category/edit-item", {
      pageTitle: "Chỉnh sửa danh mục",
      record: record,
      records: newRecords
    });
  } catch (error) {
    res.redirect(`${systempConfig.PATH_ADMIN}/products-category`);
  }
}

// [PATCH] /admin/products-category/edit/:id
module.exports.editPacth = async (req, res) => {
  try {
    if (res.locals.role.permissions.includes("products-category_edit")) {
      const id = req.params.id;

      if (req.body.position == "") {
        const countItem = await ProductsCategory.countDocuments({ deleted: false });
        req.body.position = countItem + 1;
      } else {
        req.body.position = parseInt(req.body.position);
      }

      const dataEdit = req.body;

      req.flash("success", "Chỉnh sửa thành công");

      await ProductsCategory.updateOne({
        _id: id
      }, dataEdit);

      res.redirect(`${systempConfig.PATH_ADMIN}/products-category`);
    } else {
      return;
    }
  } catch (error) {
    res.redirect(`${systempConfig.PATH_ADMIN}/products-category`);
  }
}

// [PATCH] /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    if (res.locals.role.permissions.includes("products-category_edit")) {
      const status = req.params.status;
      const id = req.params.id;

      const productCategory = await ProductsCategory.findOne({
        _id: id
      });

      if (productCategory) {
        await ProductsCategory.updateOne({
          _id: id
        }, {
          status: status
        });

        req.flash("success", "Cập nhập trạng thái thành cônggg");

        res.json({
          code: 200,
          message: "Thay đổi trạng thái thành công"
        });
      }
    } else {
      return;
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Thay đổi trạng thái không thành công!!!"
    });
  }
}

// [PATCH] /admin/products-category/change-status/:status/:id
module.exports.delete = async (req, res) => {
  try {
    if (res.locals.role.permissions.includes("products-category_del")) {
      const id = req.params.id;

      const productCategory = await ProductsCategory.findOne({
        _id: id
      });

      if (productCategory) {
        await ProductsCategory.updateOne({
          _id: id
        }, {
          deleted: true
        });

        req.flash("success", "Xóa thành công");

        res.json({
          code: 200,
          message: "Thay đổi trạng thái thành công"
        });
      }
    } else {
      return;
    }
  } catch (error) {
    req.flash("error", "Xóa không thành công");
    res.json({
      code: 400,
      message: "Thay đổi trạng thái không thành công!!!"
    });
  }
}