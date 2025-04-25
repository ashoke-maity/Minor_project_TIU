const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

function dbConnect() {
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("MongoDB Connected successfully");
    })
};

module.exports = dbConnect;