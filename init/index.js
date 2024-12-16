//This file is for data initialization
if (process.env.NODE_ENV != "production") {
  require("dotenv").config({ path: "../.env" });
}

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.DB_URL;

if (!dbUrl) {
  throw new Error("DB_URL is not defined in your .env file");
}

console.log("Connecting to MongoDB:", dbUrl);

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Error connecting to DB:", err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6730478318b01ba53496ec22",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
};

initDB();
