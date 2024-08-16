const mongoose = require("mongoose");


// creat a function to store the user details
const RefDoc = new mongoose.Schema({
    data:{
        type:String
    }

})

module.exports = mongoose.model('RefDoc',RefDoc)