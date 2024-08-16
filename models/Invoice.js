const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    location_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Locations"
    },
    CreatedOn: {
        type: Date,
    },
    Order_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "PO"
    },
    SubTotal: {
        type: Number
    },
    TotalTAX: {
        type: Number
    },
    DiscountPerc: {
        type: Number
    },
    Discount: {
        type: Number
    },
    AmountPayable: {
        type: Number
    },
    AmountPaid: {
        type: Number
    },
    Balance: {
        type: Number
    },
    PaymentType: {
        type: String
    }
})

module.exports = mongoose.model("Invoice", InvoiceSchema);