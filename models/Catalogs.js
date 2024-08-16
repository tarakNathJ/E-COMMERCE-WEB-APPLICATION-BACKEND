const mongoose = require('mongoose')

const CatalogsSchema = new mongoose.Schema({
    location_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Locations"
    },
    CreatedOn: {
        type: Date,

    },
    CatalogName: {
        type: String,
    },
    Image: {
        type: String,
    },
    Status: {
        type: String
    }
})

module.exports = mongoose.model("Catalogs", CatalogsSchema);