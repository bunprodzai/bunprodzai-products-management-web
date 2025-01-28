// change status category
const buttonChangeStatusCategory = document.querySelectorAll("[button-change-status-category]")
if (buttonChangeStatusCategory.length > 0) {
  buttonChangeStatusCategory.forEach(button => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");
      console.log(statusCurrent, id);

      let statusChange = statusCurrent == "active" ? "inactive" : "active";

      const path = `/admin/products-category/change-status/${statusChange}/${id}`;

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

// end change status category

// detele produc

const buttonDel = document.querySelectorAll("[button-delete]");
if (buttonDel) {
  buttonDel.forEach(button => {
    button.addEventListener("click", () => {
      const isComfirm = confirm("Bạn chắc chắn muốn xóa!");
      if (isComfirm) {
        const id = button.getAttribute("data-id");
        const path = `/admin/products-category/delete/${id}`;

        const option = {
          method: "PATCH"
        }

        fetch(path, option)
          .then(res => res.json())
          .then(data => {
            if (data.code == 200) {
              alert("Xóa thành công");
              window.location.reload();
            } else {
              alert("Xóa không thành công");
            }
          });
      }
    })
  })
}

// end detele produc
