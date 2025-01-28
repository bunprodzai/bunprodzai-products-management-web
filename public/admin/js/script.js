const buttonStatus = document.querySelectorAll("[button-status]");

if (buttonStatus.length > 0) {
  buttonStatus.forEach(button => {
    let url = new URL(window.location.href); // lấy ra url, URL có các hàm để set params cho url
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");
      if (status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }
      window.location.href = url.href;
    });
  });
}

const form = document.querySelector("#form-search");
if (form) {
  let url = new URL(window.location.href);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = e.target.elements.keyword.value;
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  });
}

// pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if (buttonPagination) {
  buttonPagination.forEach(button => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");
      let url = new URL(window.location.href);

      if (page) {
        url.searchParams.set("page", page);
      } else {
        url.searchParams.set("page", "1");
      }
      window.location.href = url.href;

    })
  })
}
// end pagination 


// change-multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputIds = checkboxMulti.querySelectorAll("input[name='id']");

  inputCheckAll.addEventListener("click", () => { // xử lí click checkbox
    if (inputCheckAll.checked) {
      inputIds.forEach(input => {
        input.checked = true;
      });
    } else {
      inputIds.forEach(input => {
        input.checked = false;
      });
    }
  });

  inputIds.forEach(input => { // kiểm tra các ô checkbox
    input.addEventListener("click", () => {
      const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length
      const countInputId = inputIds.length;
      if(countChecked === countInputId){
        inputCheckAll.checked = true;
      }else{
        inputCheckAll.checked = false;
      }
    })
  });

}

// end change-multi

// form change multi 
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti){
  formChangeMulti.addEventListener("submit",(e) => {
    e.preventDefault();
    const typeChange = e.target.elements.type.value;
    const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");
    if(inputsChecked.length > 0){
      let ids = [];
      const inputIds = formChangeMulti.querySelector("input[name='ids']");

      inputsChecked.forEach((input) => {
        const id = input.value;

        if(typeChange == "change-position"){
          const position = input.closest("tr").querySelector("input[name='position']").value;
          ids.push(`${id}-${position}`);
        } else {
          ids.push(id);
        }
      });

      inputIds.value = ids.join(", ");
      formChangeMulti.submit();
    }
  }); 
}

// end form change multi 

// show alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert){
  const time = parseInt(showAlert.getAttribute("data-time"));
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);
}

// end show alert
