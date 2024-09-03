const mongooose = require("mongoose");
require("dotenv").config();
const DB_URI = process.env.DB_URI;

module.exports.DBConnection = () => {
  mongooose.connect(DB_URI);
  const db = mongooose.connection;
  db.on("error", console.error.bind(console, "DB connection error"));
  db.once("open", () => console.log("DB connected"));
};
