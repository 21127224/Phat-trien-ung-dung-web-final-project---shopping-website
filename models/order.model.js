const mongodb = require("mongodb");

const db = require("../data/database");

class Order {
  // Status => pending, fulfilled, cancelled
  constructor(cart, userData, status = "pending", date, orderId) {
    this.productData = cart;
    this.userData = userData;
    this.status = status;
    this.date = new Date(date);
    if (this.date) {
      this.formattedDate = this.date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    this.id = orderId;
  }

  static transformOrderDocument(orderDoc) {
    return new Order(
      orderDoc.productData,
      orderDoc.userData,
      orderDoc.status,
      orderDoc.date,
      orderDoc._id
    );
  }

  static transformOrderDocuments(orderDocs) {
    return orderDocs.map(this.transformOrderDocument);
  }

  static async findAll() {
    const orders = await db
      .getDb()
      .collection("orders")
      .find()
      .sort({ _id: -1 })
      .toArray();

    return this.transformOrderDocuments(orders);
  }

  static async findAllForUser(userId) {
    const orders = await db
      .getDb()
      .collection("orders")
      .find({ "userData.id": userId })
      .sort({ _id: -1 })
      .toArray();

    return this.transformOrderDocuments(orders);
  }

  static async findByPendingStatus(userId) {
    const order = await db
      .getDb()
      .collection("orders")
      .findOne({ $and: [{ "userData.id": userId }, { status: "pending" }] });

    if (order) {
      return this.transformOrderDocument(order);
    } else {
      return null;
    }
  }

  static async findByCancelledStatus(userId) {
    const orders = await db
      .getDb()
      .collection("orders")
      .find({ $and: [{ "userData.id": userId }, { status: "cancelled" }] })
      .sort({ _id: -1 })
      .toArray();

    if (orders) {
      return this.transformOrderDocuments(orders);
    } else {
      return [];
    }
  }

  static async findById(orderId) {
    const order = await db
      .getDb()
      .collection("orders")
      .findOne({ _id: new mongodb.ObjectId(orderId) });

    return this.transformOrderDocument(order);
  }

  save() {
    if (this.id) {
      const orderId = new mongodb.ObjectId(this.id);
      return db
        .getDb()
        .collection("orders")
        .updateOne({ _id: orderId }, { $set: { status: this.status } });
    } else {
      const orderDocument = {
        userData: this.userData,
        productData: this.productData,
        date: new Date(),
        status: this.status,
      };

      return db.getDb().collection("orders").insertOne(orderDocument);
    }
  }

  remove() {
    const orderId = new mongodb.ObjectId(this.id);
    return db.getDb().collection("orders").deleteOne({ _id: orderId });
  }
}

module.exports = Order;
