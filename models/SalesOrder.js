const mongoose = require("mongoose");

const SalesOrderSchema = new mongoose.Schema({
    location_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Locations"
    },
    CreatedOn: {
        type: Date,
    },
    ProfiteCounterID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Supplier"
    },
    OrderType: {
        type: String,
        required: ["OPEN_BOX", "MANUAL"],
        trim: true,
    },
    InvStatus: {
        type: String
    },
    CreatedBy: {
        type: String
    },
    Status: {
        type: String
    },
    StatusDate: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Order", SalesOrderSchema);