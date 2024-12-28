const Order = require("../models/order.model");
const User = require("../models/user.model");
const Pay_Account = require("../models/pay.model");
const sessionFlash = require("../util/session-flash");

async function getOrders(req, res, next) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    const pending_order = await Order.findByPendingStatus(res.locals.uid);
    const today = new Date();
    let sessionData = sessionFlash.getSessionData(req);

    if (!sessionData) {
      sessionData = {
        message: null,
        isError: false,
      };
    }

    if (pending_order) {
      const isCancelled =
        Math.abs(today - pending_order.date) / (3600 * 1000) >= 24;
      if (isCancelled) {
        pending_order.status = "cancelled";
        await pending_order.save();
      }
    }

    res.render("shared/orders/order-list", {
      orders: orders,
      inputData: sessionData,
    });
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  try {
    const cart = res.locals.cart;
    const customerDocument = await User.findById(res.locals.uid);
    const newOrder = new Order(cart, customerDocument);
    const customer_username = customerDocument.username;
    const customer_surplus = (
      await Pay_Account.findByUsername(customer_username)
    ).surplus;
    const pending_order = await Order.findByPendingStatus(res.locals.uid);

    if (pending_order) {
      sessionFlash.flashDataToSession(
        req,
        {
          message: "You have an order that have not been paid for yet.",
          isError: true,
        },
        function () {
          res.redirect("/cart");
        }
      );
      return;
    }

    if (customer_surplus >= cart.totalPrice) {
      req.session.cart = null;
      newOrder.status = "fulfilled";
      await newOrder.save();

      res.redirect(
        `https://localhost:8000/transfer?username=${customer_username}&price=${cart.totalPrice}&isAddOrder=true`
      );

      return;
    }

    if (!pending_order) {
      await newOrder.save();
    }
    sessionFlash.flashDataToSession(
      req,
      {
        message: `Your current account balance is ${customer_surplus}, not enough to pay. The order has been added to history with a pending status.`,
        isError: true,
      },
      function () {
        res.redirect("/cart");
      }
    );
  } catch (error) {
    next(error);
  }
}

async function cancelOrder(req, res, next) {
  try {
    const pending_order = await Order.findByPendingStatus(res.locals.uid);
    pending_order.status = "cancelled";
    await pending_order.save();

    res.redirect("/orders");
  } catch (error) {
    next(error);
  }
}

async function payOrder(req, res, next) {
  try {
    const customerDocument = await User.findById(res.locals.uid);
    const customer_username = customerDocument.username;
    const customer_surplus = (
      await Pay_Account.findByUsername(customer_username)
    ).surplus;
    const pending_order = await Order.findByPendingStatus(res.locals.uid);

    if (customer_surplus >= pending_order.productData.totalPrice) {
      pending_order.status = "fulfilled";
      await pending_order.save();

      res.redirect(
        `https://localhost:8000/transfer?username=${customer_username}&price=${pending_order.productData.totalPrice}&isAddOrder=false`
      );

      return;
    }

    sessionFlash.flashDataToSession(
      req,
      {
        message: `Your current account balance is ${customer_surplus}, not enough to pay.`,
        isError: true,
      },
      function () {
        res.redirect("/orders");
      }
    );
  } catch (error) {
    next(error);
  }
}

async function emptyCancelledOrders(req, res, next) {
  try {
    const orders = await Order.findByCancelledStatus(res.locals.uid);

    for (const order of orders) {
      order.remove();
    }

    res.redirect("/orders");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addOrder: addOrder,
  cancelOrder: cancelOrder,
  payOrder: payOrder,
  emptyCancelledOrders: emptyCancelledOrders,
  getOrders: getOrders,
};
