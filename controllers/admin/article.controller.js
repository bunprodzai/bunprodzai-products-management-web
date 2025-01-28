const Article = require("../../models/acticles.model");
const Account = require("../../models/accounts.model");

const systempConfig = require("../../configs/system");

// [GET] /article/
module.exports.index = async (req, res) => {

  const records = await Article.find({ deleted: false });

  for (const item of records) {
    const account = await Account.findOne({ deleted: false, _id: item.createBy.user_Id });
    if (account) {
      item.fullName = account.fullName;
    }

    const updatedBy = item.updatedBy[item.updatedBy.length - 1];
    if (updatedBy) {
      const userUpdated = await Account.findOne({ _id: updatedBy.user_Id });
      updatedBy.accountFullName = userUpdated.fullName;
    }

  }

  res.render("admin/pages/articles/index", {
    pageTitle: "Trang bài viết",
    articles: records
  });
}

module.exports.create = async (req, res) => {

  res.render("admin/pages/articles/create", {
    pageTitle: "Tạo bài viết"
  });
}

module.exports.createPost = async (req, res) => {
  if (res.locals.role.permissions.includes("articles_create")) {
    if (req.body.position == "") {
      const countItem = await Article.countDocuments({ deleted: false });
      req.body.position = countItem + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    req.body.createBy = {
      user_Id: res.locals.user.id
    }

    const article = new Article(req.body);
    await article.save();

    req.flash("success", "Tạo mới thành công");
    res.redirect(`${systempConfig.PATH_ADMIN}/articles`);
  } else {
    return;
  }
}

module.exports.edit = async (req, res) => {
  const id = req.params.id;

  const article = await Article.findOne({ deleted: false, _id: id });


  res.render("admin/pages/articles/edit", {
    pageTitle: "Chỉnh sửa bài viết",
    article: article
  })
}

module.exports.editPatch = async (req, res) => {
  try {
    if (res.locals.role.permissions.includes("articles_edit")) {
      const id = req.params.id;
      
      if (req.body.position == "") {
        const countItem = await Products.countDocuments({ deleted: false });
        req.body.position = countItem + 1;
      } else {
        req.body.position = parseInt(req.body.position);
      }

      const dataEdit = req.body;

      const updatedBy = {
        user_Id: res.locals.user.id,
        updatedAt: new Date()
      }

      await Article.updateOne({
        _id: id
      }, { ...dataEdit, $push: { updatedBy: updatedBy } }
      );

      req.flash("success", "Chỉnh sửa thành công");
      res.redirect(`${systempConfig.PATH_ADMIN}/articles`);
    } else {
      return;
    }
  } catch (error) {
    res.redirect(`${systempConfig.PATH_ADMIN}/articles`);
  }
}

module.exports.detail = async (req, res) => {
  const id = req.params.id;

  const article = await Article.findOne({ deleted: false, _id: id });

  res.render("admin/pages/articles/detail", {
    pageTitle: "Chỉnh sửa bài viết",
    article: article
  })
}

module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const article = await Article.findOne({
      _id: id
    });
    const deletedBy = {
      user_Id: res.locals.user.id,
      deletedAt: new Date()
    }
    if (article) {
      await Article.updateOne({
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
