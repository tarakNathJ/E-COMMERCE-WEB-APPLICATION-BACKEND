const mongoose = require("mongoose");


// creat a function to store the user details
const ProductSericeSchema = new mongoose.Schema({
    SericeName: {
        type: String
    },
    Location_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Locations"
    },
    Variant_ID: [{
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: "Variants"
    }],
    Status: {
        type: String
    },
    StatusDate: {
        type: Date,
        default: Date.now()
    }


})

module.exports = mongoose.model('ProductSerice', ProductSericeSchema)