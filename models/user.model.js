const bcrypt = require("bcryptjs");
const mongodb = require("mongodb");

const db = require("../data/database");

class User {
  constructor(userData) {
    this.username = userData.username;
    this.password = userData.password;
    this.fullname = userData.fullname;
    this.address = userData.address;
    this.birthday = userData.birthday;
    this.gender = userData.gender;
    this.phone = userData.phone;
    this.email = userData.email;
    this.image = userData.image;
    this.updateImageData();
    if (userData._id) {
      this.id = userData._id.toString();
    }
    this.GoogleOrFacebookUsername = userData.GoogleOrFacebookUsername;
  }

  static async findById(userId) {
    let uId;
    try {
      uId = new mongodb.ObjectId(userId);
    } catch (error) {
      error.code = 404;
      throw error;
    }
    const user = await db
      .getDb()
      .collection("users")
      .findOne({ _id: uId }, { projection: { password: 0 } });

    if (!user) {
      const error = new Error("Could not find user with provided id.");
      error.code = 404;
      throw error;
    }

    return new User(user);
  }

  static findAll() {
    return db.getDb().collection("users").find().toArray();
  }

  static findFirstNormal() {
    return db
      .getDb()
      .collection("users")
      .findOne({ GoogleOrFacebookUsername: "" });
  }

  async getWithSameGoogleOrFacebookUsername() {
    return db
      .getDb()
      .collection("users")
      .findOne({ GoogleOrFacebookUsername: this.username });
  }

  async getWithSameUsername() {
    return db.getDb().collection("users").findOne({ username: this.username });
  }

  async signup(isAdmin) {
    const hashedPassword = await bcrypt.hash(this.password, 12);

    await db.getDb().collection("users").insertOne({
      username: this.username,
      password: hashedPassword,
      fullname: this.fullname,
      address: this.address,
      birthday: this.birthday,
      gender: this.gender,
      phone: this.phone,
      email: this.email,
      image: this.image,
      GoogleOrFacebookUsername: this.GoogleOrFacebookUsername,
      isAdmin: isAdmin,
    });
  }

  hasMatchingPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }

  updateImageData() {
    this.imagePath = `image-data/images/${this.image}`;
    this.imageUrl = `/assets/images/${this.image}`;
  }

  async save() {
    const userData = {
      username: this.username,
      fullname: this.fullname,
      address: this.address,
      birthday: this.birthday,
      gender: this.gender,
      phone: this.phone,
      email: this.email,
      image: this.image,
      GoogleOrFacebookUsername: this.GoogleOrFacebookUsername,
    };

    const userId = new mongodb.ObjectId(this.id);

    if (!this.image) {
      delete userData.image;
    }

    await db.getDb().collection("users").updateOne(
      { _id: userId },
      {
        $set: userData,
      }
    );
  }

  replaceImage(newImage) {
    this.image = newImage;
    this.updateImageData();
  }

  remove() {
    const userId = new mongodb.ObjectId(this.id);
    return db.getDb().collection("users").deleteOne({ _id: userId });
  }
}

module.exports = User;
