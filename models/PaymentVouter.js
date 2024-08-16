const mongoose = require('mongoose');

const PaymentVouterSchema = new mongoose.Schema({
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
        ref:"AccountPayable" 
    },
    TotalDue:{
        type:Number
    },
    TotalPaid:{
        type:Number
    },
    PaidOn:{
        type:Date
    },
    PayChancel:{
        type:String
    },
    PaymentDoc:{
        type:String
    },
    PayDocValidity:{
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

module.exports = mongoose.model('PaymentVouter',PaymentVouterSchema)