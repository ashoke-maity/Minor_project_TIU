const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  try {
    const connect = await mongoose.connect(process.env.DATABASE);
    console.log(
      `Database Connected : ${connect.connection.host}, ${connect.connection.name}`
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

module.exports = dbConnect;
