const Category = require("../models/category.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const Order = require("../models/order.model");;
const sessionFlash = require("../util/session-flash");
const fs = require("fs");
const path = require("path");
const { isError } = require("util");

//Categories Manage
async function createNewCategory(req, res, next) {
  const category = new Category({
    ...req.body,
  });

  try {
    await category.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/categories?message=0");
}

async function updateCategory(req, res, next) {
  const category = new Category({
    ...req.body,
    _id: req.params.id,
  });

  try {
    await category.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/categories?message=1");
}

async function deleteCategory(req, res, next) {
  let category, products;
  try {
    products = await Product.findByCateId(req.params.id);
    category = await Category.findById(req.params.id);
    products.forEach((element) => {
      element.remove();
    });
    await category.remove();
  } catch (error) {
    return next(error);
  }

  res.redirect("/categories?message=2");
}

//Products Manage
async function createNewProduct(req, res, next) {
  try {
    const product = new Product({
      ...req.body,
      image: req.file.filename,
      date: new Date(),
    });

    await product.save();

    res.redirect(`/categories/${product.cateId}?message=0`);
  } catch (error) {
    return next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = new Product({
      _id: req.params.id,
      ...req.body,
      date: new Date(),
    });

    if (req.file) {
      product.replaceImage(req.file.filename);
    }
    await product.save();

    res.redirect(`/categories/${product.cateId}?message=1`);
  } catch (error) {
    return next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    const filePath = path.join(__dirname, product.image);
    await product.remove();

    res.redirect(`/categories/${product.cateId}?message=2`);
  } catch (error) {
    return next(error);
  }
}

//Accounts Manage
async function createNewAccount(req, res, next) {
  const enteredData = {
    ...req.body,
    cityID: req.body.city,
    districtID: req.body.district,
    wardID: req.body.ward,
  };

  if (enteredData.password !== enteredData.confirmPassword) {
    sessionFlash.flashDataToSession(
      req,
      {
        message: "Password confirmation failed",
        isError: true,
        ...enteredData,
      },
      function () {
        res.redirect("/accounts");
      }
    );
    return;
  }

  const user = new User({
    ...enteredData,
    address: `${enteredData.street}, ${enteredData.ward}, ${enteredData.district}, ${enteredData.city}`,
    image: "user.png",
    GoogleOrFacebookUsername: "",
  });

  try {
    const existsAlready = await user.getWithSameUsername();

    if (existsAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          message: `The username "${enteredData.username}" already exists`,
          isError: true,
          ...enteredData,
        },
        function () {
          res.redirect("/accounts");
        }
      );
      return;
    }

    await user.signup("true" === enteredData.type);

    res.redirect(
      `https://localhost:8080/?username=${enteredData.username}&login=2`
    );
  } catch (error) {
    return next(error);
  }
}

async function deleteAccount(req, res, next) {
  const user = await User.findById(req.params.id);

  try {
    await user.remove();
  } catch (error) {
    return next(error);
  }

  res.redirect(`https://localhost:8080/delete?username=${user.username}`);
}

//Orders Manage
async function getAllOrders(req, res, next) {
  try {
    const orders = await Order.findAll();
    res.render("shared/orders/order-list", {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createNewCategory: createNewCategory,
  updateCategory: updateCategory,
  deleteCategory: deleteCategory,

  createNewProduct: createNewProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,

  createNewAccount: createNewAccount,
  deleteAccount: deleteAccount,

  getAllOrders: getAllOrders,

};
