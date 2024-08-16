const mongoose = require('mongoose');

const ReturnLinesSchema = new mongoose.Schema({
    location_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Locations"
    },
    CreatedOn: {
        type: Date,
    },
    ReturnOrder_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "PO"
    },
    Variants_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Variants"
    },
    SUK: {
        type: String
    },
    ItmeName: {
        type: String
    },
    UnitPrice: {
        type: Number
    },
    QTY: {
        type: Number
    },
    TotalPrice: {
        type: Number
    },
    Condition: {
        type: String
    },
    Picture1: {
        type: String
    },
    Status: {
        type: String
    },
    StatusDate: {
        Type: Date,
        default: Date.now()
    }
})
module.exports = mongoose.model("ReturnLines", ReturnLinesSchema)