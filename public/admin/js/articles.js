

const delArticle = document.querySelector("[button-delete-article]");
if(delArticle) {
  delArticle.addEventListener("click", () => {
    const isComfirm = confirm("Bạn chắc chắn muốn xóa!");
      if (isComfirm) {
        const idArticle = delArticle.getAttribute("data-id");
        const path = `/admin/articles/delete/${idArticle}`;

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
}