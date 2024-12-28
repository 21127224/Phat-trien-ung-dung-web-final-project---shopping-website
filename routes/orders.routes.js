const express = require("express");

const ordersController = require("../controllers/orders.controller");

const router = express.Router();

router.post("/", ordersController.addOrder);

router.post("/cancel", ordersController.cancelOrder);

router.post("/pay", ordersController.payOrder);

router.post("/empty", ordersController.emptyCancelledOrders);

router.get("/", ordersController.getOrders);

module.exports = router;
