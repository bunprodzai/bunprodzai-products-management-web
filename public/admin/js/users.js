
const buttonChangeStatusUser = document.querySelectorAll("[button-change-status-user]");
if (buttonChangeStatusUser.length > 0) {
  buttonChangeStatusUser.forEach(button => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");

      let statusChange = statusCurrent == "active" ? "inactive" : "active";

      const path = `/admin/users/change-status/${statusChange}/${id}`;

      const option = {
        method: "PATCH"
      }

      fetch(path, option)
        .then(res => res.json())
        .then(data => {
          if (data.code == 200) {
            window.location.reload();
          }
        });
    })
  })
}

// end change status

// detele user

const buttonDel = document.querySelectorAll("[button-delete]");
if (buttonDel) {
  buttonDel.forEach(button => {
    button.addEventListener("click", () => {
      const isComfirm = confirm("Bạn chắc chắn muốn xóa!");
      if (isComfirm) {
        const id = button.getAttribute("data-id");
        const path = `/admin/users/delete/${id}`;

        const option = {
          method: "PATCH"
        }

        fetch(path, option)
          .then(res => res.json())
          .then(data => {
            window.location.reload();
          })
          .catch(error => {
            alert("Có lỗi xảy ra: " + error.message);
          });
      }
    })
  })
}

// end detele user