const express = require("express");

const accountsController = require("../controllers/accounts.controller");
const imageUploadMiddleware = require("../middlewares/image-upload");

const router = express.Router();

router.get("/accounts", accountsController.getAllAccounts);

router.get("/profile", accountsController.getAccount);

router.post(
  "/accounts",
  imageUploadMiddleware,
  accountsController.updateAccount
);

router.post("/accounts/delete", accountsController.deleteOwnAccount);

module.exports = router;
