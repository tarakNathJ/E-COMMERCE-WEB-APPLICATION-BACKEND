const mongoose = require("mongoose");


const PolinesSchema = new mongoose.Schema({
    location_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Locations"
    },
    CreatedOn: {
        type: Date,
    },
    PO_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "PO"
    },
    Catalogs_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Catalogs"

    },
    Product_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    },
    Variant_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Variants"
    },
    Supplier_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Supplier"
    },
    StockTransfer_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "StockTransfer"
    },
    ItmeName: {
        type: String,
    },
    SKU: {
        type: String,
    },
    UOM: {
        type: String
    },
    UnitePrice: {
        type: Number
    },
    OrderQTY: {
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

module.exports = mongoose.model("Polines", PolinesSchema);