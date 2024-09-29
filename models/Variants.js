const mongoose = require('mongoose')
const Product = require('./Product')
const { required } = require('nodemon/lib/config')


const VariantsSchema = new mongoose.Schema({
    location_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Locations",
    },
    CreatedOn: {
        type: Date,

    },
    Product_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
    },
    ProductSerice_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "ProductSerice",
    },
    ItmeImage: {
        type: String
    },
    ItmeName: {
        type: String
    },
    Vendor_SUK: {
        type: String
    },
    TypeColour: {
        type: String,
    },
    Size: {
        type: String
    },
    SUK: {
        type: String
    },
    UOM: {
        type: String
    },
    Supplier_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Supplier"
    },
    Catalogs_ID: {
        type: mongoose.Schema.Types.ObjectId,

        ref: "Catalogs"
    },
    PurchasePrice: {
        type: Number,

    },
    ProductType: {
        type: String,
    },
    ListPrice: {
        type: Number,
    },
    StorageLocation: {
        type: String
    }
})

module.exports = mongoose.model("Variants", VariantsSchema);