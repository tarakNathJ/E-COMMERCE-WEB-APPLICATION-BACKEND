const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');

const SupplierSchema = new mongoose.Schema({
    location_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Locations"
    },
    CreatedOn: {
        type: Date,
        default: Date.now()
    },
    SupplierName: {
        type: String
    },
    ContactPerson: {
        type: String
    },
    ContactTitle: {
        type: String
    },
    ContactEmail: {
        type: String
    },
    PhoneNo: {
        type: Number
    },
    CityNo: {
        type: Number
    },
    State: {
        type: String
    },
    Cauntry: {
        type: String
    },
    Address: {
        type: String
    },
    LicenseNum: {
        type: String,
        required: true

    },
    PaymentMethod: {
        type: String,
        required: ["GooglePay", "PhonePe", "AmazonPay", "NetBanking"],
        trim: true,
    },
    PaymentTerms: {
        type: Number
    },
    StockTransfer: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "StockTransfer"
    }],
    PO_Lines: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Polines"
    }],
    UpcomminOrderToState: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "StockTransfer"
    }],
    SendProduct: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "StockTransfer"
    }],
    UpcommingProduct: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "StockTransfer"
    }],
    Status: {
        type: String
    },
    StatusDate: {
        type: Date,
        default: Date.now()
    }

})

module.exports = mongoose.model("Supplier", SupplierSchema)