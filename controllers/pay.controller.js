const Pay_Account = require("../models/pay.model");
const sessionFlash = require("../util/session-flash");
const mongodb = require("mongodb");

async function createNewPaymentAccount(req, res, next) {
  const account = new Pay_Account({
    username: req.query.username,
    surplus: req.query.isAdmin ? 0 : 1000000,
    point: 0,
    GoogleOrFacebookUsername: req.query.GoogleOrFacebookUsername || "",
    isAdmin: "1" === req.query.isAdmin,
  });

  const existsAccounts = await account.existsAlready();

  try {
    if (!existsAccounts) await account.add();
  } catch (error) {
    next(error);
    return;
  }

  sessionFlash.flashDataToSession(
    req,
    {
      message: req.query.GoogleOrFacebookUsername
        ? null
        : req.query.login === "1"
        ? "Thank you for signing up!"
        : "Adding a new account was successful.",
      isError: false,
    },
    function () {
      req.query.GoogleOrFacebookUsername
        ? res.redirect("https://localhost:8000/products?firstTime=1")
        : req.query.login === "1"
        ? res.redirect("https://localhost:8000/")
        : res.redirect("https://localhost:8000/accounts");
    }
  );
}

async function deletePaymentAccount(req, res, next) {
  const isOwn = req.query.isOwn;

  try {
    const account = await Pay_Account.findByUsername(req.query.username);
    await account.remove();
  } catch (error) {
    return next(error);
  }

  isOwn
    ? res.redirect("https://localhost:8000/logout")
    : res.redirect("https://localhost:8000/accounts");
}

async function updatePaymentAccount(req, res, next) {
  try {
    const existsAlready = await Pay_Account.findByUsername(req.query.username);

    const account = new Pay_Account({
      username: req.query.new,
      surplus: existsAlready.surplus,
      point: existsAlready.point,
      GoogleOrFacebookUsername: existsAlready.GoogleOrFacebookUsername,
      isAdmin: existsAlready.isAdmin,
    });

    await account.save(existsAlready.username);
  } catch (error) {
    return next(error);
  }

  sessionFlash.flashDataToSession(
    req,
    {
      message: "Updating the account was successful.",
      isError: false,
    },
    function () {
      res.redirect("https://localhost:8000/profile");
    }
  );
}

async function transfer(req, res, next) {
  try {
    const admin = await Pay_Account.findAdmin();
    const customer = await Pay_Account.findByUsername(req.query.username);
    const admin_surplus = admin.surplus + parseInt(req.query.price);
    const customer_surplus = customer.surplus - parseInt(req.query.price);
    const customer_point = customer.point + parseInt(req.query.price) / 1000;
    const isAddOrder = req.query.isAddOrder === "true";

    let account = new Pay_Account({
      username: admin.username,
      surplus: admin_surplus,
      point: 0,
      GoogleOrFacebookUsername: admin.username,
      isAdmin: true,
    });

    await account.save(admin.username);

    account = new Pay_Account({
      username: customer.username,
      surplus: customer_surplus,
      point: customer_point,
      GoogleOrFacebookUsername: customer.GoogleOrFacebookUsername,
      isAdmin: false,
    });

    await account.save(customer.username);

    sessionFlash.flashDataToSession(
      req,
      {
        message: `Your current account balance is ${customer_surplus}. You get ${
          parseInt(req.query.price) / 1000
        } points in your account`,
        isError: false,
      },
      function () {
        isAddOrder
          ? res.redirect("https://localhost:8000/cart")
          : res.redirect("https://localhost:8000/orders");
      }
    );
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createNewPaymentAccount: createNewPaymentAccount,
  updatePaymentAccount: updatePaymentAccount,
  deletePaymentAccount: deletePaymentAccount,
  transfer: transfer,
};
