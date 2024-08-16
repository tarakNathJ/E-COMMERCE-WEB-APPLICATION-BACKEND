const mongoose = require('mongoose');

const CraditeNoteSchema =new mongoose.Schema({
    location_ID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Locations"
    },
    CreatedOn:{
        type:Date,
    },
    ReturnOrder_ID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"ReturnOrder"
    },
    CastCenterId:{
        type:Number
    },
    ReturnAmount:{
        type:Number
    }
})

module.exports = mongoose.model('CraditeNote',CraditeNoteSchema);