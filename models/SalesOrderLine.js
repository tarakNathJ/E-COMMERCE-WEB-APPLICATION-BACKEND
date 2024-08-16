const mongoose = require('mongoose');

const SalesOrderLineSchema = new mongoose.Schema({
    location_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Locations"
    },
    CreatedOn: {
        type: Date,
    },
    Order_ID: {
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
    Status: {
        type: String
    },
    StatusDate: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("OrderLine", SalesOrderLineSchema);