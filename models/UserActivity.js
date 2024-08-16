//import mongoose to creat a schema
const mongoose = require("mongoose");

// const { Stream } = require("nodemailer/lib/xoauth2");



// creat a function to store the user details
const UserActivitySchema = new mongoose.Schema({

    Location_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Locations"
    },
    TranSactionType: {
        type: String

    },
    RefDocNum: {
        type: String
    },
    Email: {
        type: String
    },
    Password: {
        type: String
    },
    EntryNum: {
        type: String
    },
    Description: {
        type: String

    },
    ActioneType: {
        type: String,
        required: ["Custromer", "Seller", "SuperAdmin", "ProductManager", "OrganizationManager", "InventoryManager", "SalesManager", "AccountAndFinanceManager", "generalSalesManager", "InsideSalesManager", "StoreManagement", "AccountManager", "FinenceManager"],
        trim: true,
    },
    ActionedON: {
        type: Date,
        required: true,
        default: Date.now()
    },
    ActionBy: {
        type: String
    },
    Product_ID: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: "Product"

    },
    catalog_ID: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: "Catalogs"

    },
    PurchaseOrder: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variants"
    }]




})

module.exports = mongoose.model("UserActivity", UserActivitySchema);