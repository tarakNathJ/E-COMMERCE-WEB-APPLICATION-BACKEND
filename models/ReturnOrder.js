const mongoose = require('mongoose');

const ReturnOrderSchema = new mongoose.Schema({
    location_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Locations"
    },
    CreatedOn: {
        type: Date
    },
    Order_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "PO"
    },
    OrderDate: {
        type: Date
    },
    ReturnReason: {
        type: String
    },
    ApprovalStatus: {
        type: Boolean
    },
    ApprovalBy: {
        type: String
    },
    CreaditNote: {
        type: String
    },
    ReturnAmount: {
        type: Number
    },
    CreatedBy: {
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
module.exports = mongoose.model("ReturnOrder", ReturnOrderSchema);