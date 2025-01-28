// preview img

const uploadImg = document.querySelector("[upload-img]");
if (uploadImg) {
  const uploadImgInput = uploadImg.querySelector("[upload-img-input]");
  const uploadImgPreview = uploadImg.querySelector("[upload-img-preview]");
  uploadImgInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImgPreview.src = URL.createObjectURL(file);
    }
  });
  // delete Img
  const deleteImg = uploadImg.querySelector("[delete-img]");
  if (deleteImg) {
    deleteImg.addEventListener("click", (e) => {
      e.preventDefault();
      if (uploadImgInput) {
        uploadImgInput.value = "";
        uploadImgPreview.src = "";
      }
    });
  }
//   // end deleteImg
}

// end preview img
