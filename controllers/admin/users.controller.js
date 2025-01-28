// file này dùng để tạo hàm render ra giao diện 
const User = require("../../models/users.model");
const md5 = require("md5");


// [GET] /admin/users
module.exports.index = async (req, res) => {

  const find = {
    deleted: false
  }
  const records = await User.find(find).select("-password -tokenUser");

  res.render("admin/pages/users/index", {
    pageTitle: "Trang tài khoản người dùng",
    records: records
  });
}

// [PATCH] /admin/users/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const id = req.params.id;

    const user = await User.findOne({
      _id: id
    });

    if (user) {
      await User.updateOne({
        _id: id
      }, {
        status: status
      });

      req.flash("success", "Cập nhập trạng thái thành công");
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

// [GET] /admin/users/edit/:idUser
module.exports.edit = async (req, res) => {
  const idUser = req.params.idUser;

  const record = await User.findOne({
    _id: idUser
  });

  res.render("admin/pages/users/edit", {
    pageTitle: "Trang chỉnh sửa thông tin khách hàng",
    record: record
  });
}

// [PATCH] /admin/users/edit/:idUser
module.exports.editPatch = async (req, res) => {
  const idUser = req.params.idUser;

  if (req.body.password) {
    req.body.password = md5(req.body.password);
  }
  await User.updateOne({ _id: idUser }, req.body);

  req.flash("success", "Cập nhật thành công");

  res.redirect(`/admin/users`);
}

// [PATCH] /admin/delete
module.exports.delete = async (req, res) => {
  try {
    const idUser = req.params.idUser;

    await User.updateOne({ _id: idUser }, { deleted: true });

    req.flash("success", "Xóa tài khoản thành công");
    res.json({
      code: 200,
      message: "Xóa thành công"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Xóa không thành công"
    });
  }
}

// [GET] /admin/detail
module.exports.detail = async (req, res) => {
  try {
    const idUser = req.params.idUser;

    const user = await User.findOne({ _id: idUser }).select("-password");

    res.render("admin/pages/users/detail", {
      pageTitle: "Chi tiết tài khoản",
      user: user
    });

  } catch (error) {

  }
}