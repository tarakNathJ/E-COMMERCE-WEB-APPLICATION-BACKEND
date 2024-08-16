const mongoose = require('mongoose');

const AccountReceivablesSchema = new mongoose.Schema({
    location_ID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Locations"
    },
    CreatedOn:{
        type:Date,
    },
    ProfitCenter:{
        type:Number
    },
    RevenueType:{
        type:String
    },
    DocumentType:{
        type:String
    },
    DocumentNum:{
        type:String
    },
    TotalReceivable:{
        type:Number
    },
    ReceivedAmount:{
        type:Number 
    },
    Balance:{
        type:Number
    },
    ReceivedOn:{
        type:Date
    },
    UpdateBY:{
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

module.exports = mongoose.Schema('AccountReceivables',AccountReceivablesSchema)