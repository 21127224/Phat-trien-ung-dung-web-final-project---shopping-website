const User = require("../models/user.model");
const sessionFlash = require("../util/session-flash");

async function getAllAccounts(req, res, next) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      username: "",
      password: "",
      confirmPassword: "",
      fullname: "",
      street: "",
      ward: "Ward / Town",
      district: "District",
      city: "City / Province",
      wardID: "",
      districtID: "",
      cityID: "",
      gender: "Male",
      phone: "",
      email: "",
    };
  }

  try {
    const accounts = await User.findAll();
    res.render("admin/accounts/all-accounts", {
      accounts: accounts,
      inputData: sessionData,
    });
  } catch (error) {
    next(error);
  }
}

async function getAccount(req, res, next) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      message: null,
      isError: false,
    };
  }

  try {
    const account = await User.findById(req.session.uid);
    res.render("shared/account/profile", {
      account: account,
      message: sessionData.message,
      isError: sessionData.isError,
    });
  } catch (error) {
    next(error);
  }
}

async function updateAccount(req, res, next) {
  const oldAccount = await User.findById(req.session.uid);

  const enteredData = {
    ...req.body,
  };

  const newAccount = new User({
    _id: req.session.uid,
    ...enteredData,
    address: `${enteredData.street}, ${enteredData.ward}, ${enteredData.district}, ${enteredData.city}`,
    GoogleOrFacebookUsername: oldAccount.GoogleOrFacebookUsername,
  });

  if (req.file) {
    newAccount.replaceImage(req.file.filename);
  }

  try {
    const existsAlready = await newAccount.getWithSameUsername();
    if (newAccount.username !== oldAccount.username && existsAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          message: `The username "${enteredData.username}" already exists`,
          isError: true,
        },
        function () {
          res.redirect("/profile");
        }
      );
      return;
    }
    await newAccount.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect(
    `https://localhost:5000/update?username=${oldAccount.username}&new=${newAccount.username}`
  );
}

async function deleteOwnAccount(req, res, next) {
  const user = await User.findById(req.session.uid);

  try {
    await user.remove();
  } catch (error) {
    return next(error);
  }

  console.log(user);

  res.redirect(
    `https://localhost:5000/delete?username=${user.username}&isOwn=1`
  );
}

module.exports = {
  getAllAccounts: getAllAccounts,
  getAccount: getAccount,
  updateAccount: updateAccount,
  deleteOwnAccount: deleteOwnAccount,
};
