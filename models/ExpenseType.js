const mongoose = require('mongoose');

const ExpenseTypeSchema = new mongoose.Schema({
    location_ID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Locations"
    },
    CreatedOn:{
        type:Date,
    },
    ExpenseType:{
        type:String
    },
    Status:{
        type:String
    },
    StatusDate:{
        Type:Date,
        default:Date.now()
    }
})
module.exports = mongoose.Model("ExpenseType",ExpenseTypeSchema)