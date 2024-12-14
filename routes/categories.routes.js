const express = require("express");

const categoriesController = require("../controllers/categories.controller");

const router = express.Router();

router.get("/categories", categoriesController.getAllCategories);

router.get("/categories/:cateID", categoriesController.getProductsOfCategory);

module.exports = router;
