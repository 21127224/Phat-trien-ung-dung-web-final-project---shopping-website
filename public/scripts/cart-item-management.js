const cartItemElements = $(".cart-item");
const cartTotalPriceElement = $("#cart-total-price");
const cartPointsElement = $("#cart-points");
const cartBadgeElements = $(".nav-items .badge");
const notEmpty = $(".not-empty");

async function updateCartItem(cartItem) {
  const productId = $(cartItem).find("form").data("productid");
  const csrfToken = $(cartItem).find("form").data("csrf");
  const quantity = $(cartItem).find("input").val();
  let response;

  console.log(productId);

  try {
    response = await fetch("/cart/items", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: productId,
        quantity: quantity,
        _csrf: csrfToken,
      }),
    });
  } catch (error) {
    alert("Something went wrong!");
    return;
  }

  if (!response.ok) {
    alert("Something went wrong!");
    return;
  }

  const responseData = await response.json();
  const updatedCartData = responseData.updatedCartData;

  if (updatedCartData.updatedItemPrice === 0) {
    $(cartItem).remove();
  } else {
    $(cartItem)
      .find("span")
      .text(updatedCartData.updatedItemPrice.toLocaleString("vi-VN"));
  }

  cartTotalPriceElement.text(
    updatedCartData.newTotalPrice.toLocaleString("vi-VN")
  );

  cartPointsElement.text(
    updatedCartData.newTotalPrice.toLocaleString("vi-VN") / 1000
  );

  notEmpty.toggle(updatedCartData.newTotalPrice !== 0);

  cartBadgeElements.text(updatedCartData.newTotalQuantity);
}

cartItemElements.each(function () {
  $(this)
    .find("input")
    .change(() => updateCartItem(this));
});