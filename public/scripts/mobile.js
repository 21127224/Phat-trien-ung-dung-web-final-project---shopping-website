const mobileMenuBtnElement = $("#mobile-menu-btn");
const mobileMenuElement = $("#mobile-menu");

function toggleMobileMenu() {
  mobileMenuElement.toggleClass("open");
}

mobileMenuBtnElement.click(toggleMobileMenu);
