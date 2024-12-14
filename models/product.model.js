const mongodb = require("mongodb");

const db = require("../data/database");

class Product {
  constructor(productData) {
    this.title = productData.title;
    this.cateId = productData.cateId;
    this.summary = productData.summary;
    this.price = +productData.price;
    this.description = productData.description;
    this.image = productData.image; // the name of the image file
    this.updateImageData();
    if (productData._id) {
      this.id = productData._id.toString();
    }
    this.date = new Date(productData.date);
    if (this.date) {
      this.formattedDate = this.date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  }

  static async findById(productId) {
    let prodId;
    try {
      prodId = new mongodb.ObjectId(productId);
    } catch (error) {
      error.code = 404;
      throw error;
    }
    const product = await db
      .getDb()
      .collection("products")
      .findOne({ _id: prodId });

    if (!product) {
      const error = new Error("Could not find product with provided id.");
      error.code = 404;
      throw error;
    }

    return new Product(product);
  }

  static async findByCateId(cateID) {
    const products = await db
      .getDb()
      .collection("products")
      .find({ cateId: new mongodb.ObjectId(cateID) })
      .toArray();

    products.sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { sensitivity: "accent" })
    );

    return products.map(function (productDocument) {
      return new Product(productDocument);
    });
  }

  static async findByName(name) {
    const product = await db
      .getDb()
      .collection("products")
      .findOne({ title: name });

    if (!product) {
      return new Product("");
    }
    return new Product(product);
  }

  static async findAll() {
    const products = await db.getDb().collection("products").find().toArray();

    products.sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { sensitivity: "accent" })
    );

    return products.map(function (productDocument) {
      return new Product(productDocument);
    });
  }

  static async findMultiple(ids) {
    const productIds = ids.map(function (id) {
      return new mongodb.ObjectId(id);
    });

    const products = await db
      .getDb()
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray();

    return products.map(function (productDocument) {
      return new Product(productDocument);
    });
  }

  updateImageData() {
    this.imagePath = `image-data/images/${this.image}`;
    this.imageUrl = `/assets/images/${this.image}`;
  }

  async save() {
    const productData = {
      title: this.title,
      cateId: new mongodb.ObjectId(this.cateId),
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image,
      date: this.date,
    };

    if (this.id) {
      const productId = new mongodb.ObjectId(this.id);

      if (!this.image) {
        delete productData.image;
      }

      await db.getDb().collection("products").updateOne(
        { _id: productId },
        {
          $set: productData,
        }
      );
    } else {
      await db.getDb().collection("products").insertOne(productData);
    }
  }

  replaceImage(newImage) {
    this.image = newImage;
    this.updateImageData();
  }

  remove() {
    const productId = new mongodb.ObjectId(this.id);
    return db.getDb().collection("products").deleteOne({ _id: productId });
  }
}

module.exports = Product;
