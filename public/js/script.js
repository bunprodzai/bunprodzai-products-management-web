// show alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert){
  const time = parseInt(showAlert.getAttribute("data-time"));
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);
}

// end show alert


// active thanh menu
document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll(".inner-menu ul li a");
  const currentUrl = window.location.href;

  menuItems.forEach((item) => {
    if (item.href === currentUrl) {
      item.parentElement.classList.add("active");
    }
  });
});

// end active thanh menu
