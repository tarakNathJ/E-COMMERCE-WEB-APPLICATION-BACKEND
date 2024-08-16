const mongoose = require('mongoose');

const AccountPayableSchema = new mongoose.Schema({
    location_ID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Locations"
    },
    CreatedOn:{
        type:Date,
    },
    CostCenter:{
        type:Number,
    },
    PayableType:{
        type:String
    },
    DocumentNum:{
        type:String
    },
    DocumentType:{
        type:Number
    },
    ReferenceNum:{
        type:Number
    },
    TotalPayable:{
        type:Number
    },
    DueDate:{
        type:Number
    },
    PaidAmount:{
        type:Number
    },
    Balance:{
        type:Number
    },
    PaidOn:{
        type:Date
    }
})
module.exports = mongoose.model ("AccountPayable",AccountPayableSchema)