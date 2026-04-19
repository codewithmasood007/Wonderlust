const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  const updatedData = initData.data.map((obj) => ({
    ...obj,
    owner: new mongoose.Types.ObjectId('69cf94ce37c9075b619a7dc7'), // Replace with a valid User ID from your DB
    geometry: obj.geometry,
  }));
  await Listing.insertMany(updatedData); //
  console.log("data was initialized");
};

initDB();