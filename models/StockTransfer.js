const mongoose = require('mongoose');

const StockTransferSchema = new mongoose.Schema({
    location_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Locations"
    },
    CreatedOn: {
        type: Date,
    },
    TransferByLOC: {
        type: Number
    },
    TransferByCC: {
        type: Number
    },
    TransferQTY: {
        type: Number
    },
    TransferToLOC: {
        type: Number
    },
    TransferToCC: {
        type: Number
    },
    TransferredBy: {
        type: String
    },
    ReceivedQTY: {
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
module.exports = mongoose.model("StockTransfer", StockTransferSchema);