
// change status 
const buttonChangeStatus = document.querySelectorAll("[button-change-status]")
if (buttonChangeStatus.length > 0) {
  buttonChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");
      console.log(statusCurrent, id);

      let statusChange = statusCurrent == "active" ? "inactive" : "active";

      const path = `/admin/products/change-status/${statusChange}/${id}`;

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


// detele produc

const buttonDel = document.querySelectorAll("[button-delete]");
if (buttonDel) {
  buttonDel.forEach(button => {
    button.addEventListener("click", () => {
      const isComfirm = confirm("Bạn chắc chắn muốn xóa!");
      if (isComfirm) {
        const id = button.getAttribute("data-id");
        const path = `/admin/products/delete/${id}`;

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


// create product

const buttonCreate = document.querySelector("[form-create]");
if (buttonCreate) {
  buttonCreate.addEventListener("submit", (e) => {
    e.preventDefault();
    buttonCreate.submit();
  })
}

// end create product



// edit product

// const linkToEdit = document.querySelectorAll("[button-edit]");
// if (linkToEdit) { // khi click vào thì dẫn đến url edit
//   linkToEdit.forEach(button => {
//     button.addEventListener("click", () => {
//       const id = button.getAttribute("data-id");
//       const path = `/admin/products/edit/${id}`;
//       fetch(path)
//         .then(res => res.json())
//         .then(data => {
//         });
//     })
//   })
// }

// const buttonEdit = document.querySelector("[form-edit]");
// if (buttonEdit) {
//   buttonEdit.addEventListener("submit", (e) => {
//     e.preventDefault();
//     buttonEdit.submit();
//   })
// }

// end edit product


// sort produc
const sort = document.querySelector("[sort]");
if (sort) {
  const selectSort = sort.querySelector("[sort-select]");
  const clear = sort.querySelector("[sort-clear]");

  let url = new URL(window.location.href);

  selectSort.addEventListener("change", (e) => {
    const value = e.target.value;
    const [sortKey, sortValue] = value.split("-");

    if (sortKey || sortValue) {
      url.searchParams.set("sortKey", sortKey);
      url.searchParams.set("sortValue", sortValue);
    } else {
      url.searchParams.delete("sortKey");
      url.searchParams.delete("sortValue");
    }
    window.location.href = url.href;
  });

  clear.addEventListener("click", () => {
    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");
    window.location.href = url.href;
  });
  const sortKey = url.searchParams.get("sortKey");
  const sortValue = url.searchParams.get("sortValue");
  const value = `${sortKey}-${sortValue}`;
  if (sortKey && sortValue) {
    selectSort.value = value;

    // const optionSelected = selectSort.querySelector(`option[value='${value}']`);
    // optionSelected.selected=true //cach 2
  }
}

// end sort produc
