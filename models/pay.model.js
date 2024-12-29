const db = require("../data/database");

class Pay_Account {
  constructor(pay_accountData) {
    this.username = pay_accountData.username;
    this.surplus = pay_accountData.surplus;
    this.point = pay_accountData.point;
    this.GoogleOrFacebookUsername = pay_accountData.GoogleOrFacebookUsername;
    this.isAdmin = pay_accountData.isAdmin;
    if (pay_accountData._id) {
      this.id = pay_accountData._id.toString();
      console.log();
    }
  }

  static async findByUsername(username) {
    const payer = await db
      .getDb()
      .collection("payers")
      .findOne({ username: username });

    return new Pay_Account(payer);
  }

  async existsAlready() {
    return await db
      .getDb()
      .collection("payers")
      .findOne({
        $or: [
          { username: this.username },
          {
            $and: [
              { GoogleOrFacebookUsername: { $ne: "" } },
              { GoogleOrFacebookUsername: this.GoogleOrFacebookUsername },
            ],
          },
        ],
      });
  }

  static async findAdmin() {
    return await db.getDb().collection("payers").findOne({ isAdmin: true });
  }

  static async findAll() {
    const accounts = await db.getDb().collection("payers").find().toArray();

    return accounts.map(function (accountDocument) {
      return new Pay_Account(accountDocument);
    });
  }

  async add() {
    const pay_accountData = {
      username: this.username,
      surplus: this.surplus,
      point: this.point,
      GoogleOrFacebookUsername: this.GoogleOrFacebookUsername,
      isAdmin: this.isAdmin,
    };

    await db.getDb().collection("payers").insertOne(pay_accountData);
  }

  async save(old_un) {
    const pay_accountData = {
      username: this.username,
      surplus: this.surplus,
      point: this.point,
      GoogleOrFacebookUsername: this.GoogleOrFacebookUsername,
      isAdmin: this.isAdmin,
    };

    await db.getDb().collection("payers").updateOne(
      { username: old_un },
      {
        $set: pay_accountData,
      }
    );
  }

  remove() {
    const username = this.username;
    return db.getDb().collection("payers").deleteOne({ username: username });
  }
}

module.exports = Pay_Account;
