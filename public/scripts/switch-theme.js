const switchButton = $("#switchCheck");
const bodyTag = $("body");
const mainHeader = $("#main-header");
const borderButtons = $(".btn-alt");
const solidButtons = $(".btn-solid");
const productHeader = $("#product-details header");
const productDescription = $("#product-description");
const productItems = $(".product-item-content");
const orderItems = $(".order-item");
const badge = $(".badge");
const cartItems = $(".cart-item");
const cartTotal = $(".cart-total p");
const form = $(".form");
const mobileMenu = $("#mobile-menu");

function setTheme() {
  const isChecked = switchButton.prop("checked");

  bodyTag.css({
    backgroundColor: isChecked ? "white" : "var(--color-gray-500)",
    color: isChecked ? "black" : "var(--color-gray-100)",
  });

  mainHeader.css({
    backgroundColor: isChecked ? "white" : "var(--color-gray-500)",
    borderBottom: isChecked
      ? "1px solid green"
      : "1px solid var(--color-primary-500)",
    color: isChecked ? "green" : "var(--color-primary-400)",
  });
  mainHeader
    .find("button, a")
    .css("color", isChecked ? "green" : "var(--color-primary-400)");
  mainHeader
    .find("span, .badge")
    .css("backgroundColor", isChecked ? "green" : "var(--color-primary-400)");
  mainHeader.find(".fa-sun").css("display", isChecked ? "inline" : "none");
  mainHeader.find(".fa-moon").css("display", isChecked ? "none" : "inline");
  mainHeader
    .find(".dropdown-menu")
    .css("backgroundColor", isChecked ? "white" : "var(--color-gray-500)");

  solidButtons.css({
    backgroundColor: isChecked ? "green" : "var(--color-primary-500)",
    border: isChecked
      ? "1px solid green"
      : "1px solid var(--color-primary-500)",
  });

  borderButtons.css({
    color: isChecked ? "green" : "var(--color-primary-500)",
    border: isChecked
      ? "1px solid green"
      : "1px solid var(--color-primary-500)",
  });

  badge.css(
    "backgroundColor",
    isChecked ? "green" : "var(--color-primary-400)"
  );

  productItems.css({
    backgroundColor: isChecked ? "#E6E6E6" : "var(--color-gray-400)",
    color: isChecked ? "black" : "var(--color-gray-100)",
  });

  orderItems.css(
    "backgroundColor",
    isChecked ? "#E6E6E6" : "var(--color-gray-400)"
  );
  orderItems
    .find(".order-item-price, a")
    .css("color", isChecked ? "green" : "var(--color-primary-500)");

  cartItems.css(
    "backgroundColor",
    isChecked ? "#E6E6E6" : "var(--color-gray-400)"
  );

  mobileMenu.css(
    "backgroundColor",
    isChecked ? "white" : "var(--color-gray-700)"
  );
  mobileMenu
    .find(".badge")
    .css("backgroundColor", isChecked ? "green" : "var(--color-primary-100)");
  mobileMenu
    .find("button, a")
    .css("color", isChecked ? "green" : "var(--color-primary-100)");

  if (productHeader) {
    productHeader.css(
      "backgroundColor",
      isChecked ? "white" : "var(--color-primary-600)"
    );
    productDescription.css(
      "backgroundColor",
      isChecked ? "#E6E6E6" : "var(--color-gray-400)"
    );
  }

  if (cartTotal) {
    cartTotal.css("color", isChecked ? "green" : "var(--color-primary-500)");
  }

  if (form) {
    form.css("backgroundColor", isChecked ? "#E6E6E6" : "black");
    form
      .find("hr")
      .css("color", isChecked ? "green" : "var(--color-primary-200)");
  }

  localStorage.clear();
  localStorage.setItem("theme", isChecked);
}

switchButton.prop("checked", localStorage.getItem("theme") === "true");
setTheme();

switchButton.click(setTheme);
