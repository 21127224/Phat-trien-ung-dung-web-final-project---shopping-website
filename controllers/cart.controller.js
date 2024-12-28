const Product = require("../models/product.model");
const User = require("../models/user.model");
const Pay_Account = require("../models/pay.model");
const sessionFlash = require("../util/session-flash");

async function getCart(req, res) {
  const user = await User.findById(res.locals.uid);
  const pay_account = await Pay_Account.findByUsername(user.username);
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      message: null,
      isError: false,
    };
  }

  res.render("customer/cart/cart", {
    inputData: sessionData,
  });
}

async function addCartItem(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.body.productId);
  } catch (error) {
    next(error);
    return;
  }

  const cart = res.locals.cart;

  cart.addItem(product);
  req.session.cart = cart;

  res.status(201).json({
    message: "Cart updated!",
    newTotalItems: cart.totalQuantity,
  });
}

function updateCartItem(req, res) {
  const cart = res.locals.cart;

  const updatedItemData = cart.updateItem(
    req.body.productId,
    +req.body.quantity
  );

  req.session.cart = cart;

  res.json({
    message: "Item updated!",
    updatedCartData: {
      newTotalQuantity: cart.totalQuantity,
      newTotalPrice: cart.totalPrice,
      updatedItemPrice: updatedItemData.updatedItemPrice,
    },
  });
}

module.exports = {
  addCartItem: addCartItem,
  getCart: getCart,
  updateCartItem: updateCartItem,
};
