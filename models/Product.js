const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({

        location_ID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Locations"
        },
        CreatedOn: {
            type: String,

        },
        product_serice: [{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "ProductSerice"

        }],
        productAcronym: {
            type: String,
        },
        Brand: {
            type: String,
        },
        Image: {
            type: String
        },
        Status: {
            type: String
        },
        StatusDate: {
            type: Date,
            default: Date.now(),
        }
    }

)


module.exports = mongoose.model("Product", ProductSchema);