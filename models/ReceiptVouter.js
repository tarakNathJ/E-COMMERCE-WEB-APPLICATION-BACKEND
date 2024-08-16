const mongoose = require('mongoose');

const ReceiptVouterSchema = new mongoose.Schema({
    location_ID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Locations"
    },
    CreatedOn:{
        type:Date,
    },
    AccountPayable_ID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"AccountReceivables" 
    },
    TotalReceived:{
        type:Number
    },
    ReceivedOn:{
        type:Date
    }
})
module.exports = mongoose.model("ReceiptVouter",ReceiptVouterSchema)