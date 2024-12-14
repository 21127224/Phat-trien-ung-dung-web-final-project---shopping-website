const addToCartButtonElement = $(".btn-solid");
const cartBadgeElements = $(".nav-items .badge");

async function addToCart() {
  const productId = addToCartButtonElement.data("productid");
  const csrfToken = addToCartButtonElement.data("csrf");

  let response;
  try {
    response = await fetch("/cart/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: productId,
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
  const newTotalQuantity = responseData.newTotalItems;

  cartBadgeElements.text(newTotalQuantity);
}

addToCartButtonElement.click(addToCart);
