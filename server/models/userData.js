const mongoose = require('mongoose');
const userDatabase = new mongoose.Schema({
    FirstName:{
        type:String,
        require: true
    },
    LastName:{
        type:String,
        require: true
    },
    Age:{
        type:Number,
        require: true
    },
    PassoutYear:{
        type: String,
        require: true
    },
    Email:{
        type:String,
        require: true,
        unique: true
    },
    Password:{
        type:String,
        require: true
    },
    ConfirmedPassword:{
        type:String,
        require:true
    }
})

const userModel = mongoose.model('userDatabase', userDatabase);
module.exports = userModel;