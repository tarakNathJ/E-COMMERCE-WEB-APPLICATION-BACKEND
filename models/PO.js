const mongoose = require("mongoose");

const PO_Schema = new mongoose.Schema({
    location_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Locations"
    },
    CreatedOn: {
        type: Date,
    },

    CreatedBY: {
        type: String
    },
    ApprovedBy: {
        type: Boolean
    },
    Status: {
        type: String
    },
    StatusDate: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("PO", PO_Schema);