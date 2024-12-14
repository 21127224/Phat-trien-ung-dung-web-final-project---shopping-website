const mongodb = require("mongodb");

const db = require("../data/database");

class Category {
  constructor(categoryData) {
    this.title = categoryData.title;
    if (categoryData._id) {
      this.id = categoryData._id.toString();
    }
  }

  static async findById(categoryId) {
    let cateId;
    try {
      cateId = new mongodb.ObjectId(categoryId);
    } catch (error) {
      error.code = 404;
      throw error;
    }
    const category = await db
      .getDb()
      .collection("categories")
      .findOne({ _id: cateId });

    if (!category) {
      const error = new Error("Could not find category with provided id.");
      error.code = 404;
      throw error;
    }

    return new Category(category);
  }

  static async findAll() {
    const categories = await db
      .getDb()
      .collection("categories")
      .find()
      .toArray();

    categories.sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { sensitivity: "accent" })
    );

    return categories.map(function (categoryDocument) {
      return new Category(categoryDocument);
    });
  }

  async save() {
    const categoryData = {
      title: this.title,
    };

    if (this.id) {
      const categoryId = new mongodb.ObjectId(this.id);

      await db.getDb().collection("categories").updateOne(
        { _id: categoryId },
        {
          $set: categoryData,
        }
      );
    } else {
      await db.getDb().collection("categories").insertOne(categoryData);
    }
  }

  remove() {
    const categoryId = new mongodb.ObjectId(this.id);
    return db.getDb().collection("categories").deleteOne({ _id: categoryId });
  }
}

module.exports = Category;
