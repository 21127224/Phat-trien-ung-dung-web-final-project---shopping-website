require("dotenv").config();

const express = require("express");
const csrf = require("csurf");
const expressSession = require("express-session");
const https = require("https");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const opts = {
  requestCert: true,
  rejectUnauthorized: false,
  key: fs.readFileSync("./localhost.key", { encoding: "utf-8" }),
  cert: fs.readFileSync("./localhost.crt", { encoding: "utf-8" }),// để mã hóa 
};

const createSessionConfig = require("./config/session");
const db = require("./data/database");
const addCsrfTokenMiddleware = require("./middlewares/csrf-token");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const checkAuthStatusMiddleware = require("./middlewares/check-auth");
const protectRoutesMiddleware = require("./middlewares/protect-routes");
const cartMiddleware = require("./middlewares/cart");
const updateCartPricesMiddleware = require("./middlewares/update-cart-prices");
const notFoundMiddleware = require("./middlewares/not-found");
const authRoutes = require("./routes/auth.routes");
const categoriesRoutes = require("./routes/categories.routes");
const productsRoutes = require("./routes/products.routes");
const accountsRoutes = require("./routes/accounts.routes");
const baseRoutes = require("./routes/base.routes");
const adminRoutes = require("./routes/admin.routes");
const ordersRoutes = require("./routes/orders.routes");
const cartRoutes = require("./routes/cart.routes");

const port = process.env.PORT | 8000;

const app = express();
const server = https.createServer(opts, app);

app.use(cors());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use("/assets", express.static("image-data"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf());

app.use(cartMiddleware);
app.use(updateCartPricesMiddleware);

app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(categoriesRoutes);
app.use(productsRoutes);
app.use(accountsRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", protectRoutesMiddleware, ordersRoutes);
app.use("/admin", protectRoutesMiddleware, adminRoutes);

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(function () {
    server.listen(port, () =>
      console.log(`Example app listening on port ${port}!`)
    );
  })
  .catch(function (error) {
    console.log("Failed to connect to the database!");
    console.log(error);
  });
