const mongoose = require('mongoose');


const ExpenseSchema = new mongoose.Schema({
    location_ID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Locations"
    },
    CreatedOn:{
        type:Date,
    },
    ExpenseType_ID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"ExpenseType"
    },
    CostCenter:{
        type:Number,
    },
    ExpenseYear:{
        type:String,
    },
    ExpenseMonth:{
        type:String,
    },
    Description:{
        type:String,
    },
    Amount:{
        type:Number,
    },
    CreatedBy:{
        type:String,
    },
    ApprovedBy:{
        type:String,
    },
    ApprovedOn:{
        type:Date,
    },
    Status:{
        type:String
    },
    StatusDate:{
        Type:Date,
        default:Date.now()
    }


})

module.exports = mongoose.model("Expense",ExpenseSchema)