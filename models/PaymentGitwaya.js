const mongoose = require('mongoose');


const PaymentSchema = new mongoose.Schema({
    razorpay_order_id: {
        type: String,

    },
    razorpay_payment_id: {
        type: String,

    },
    razorpay_signature: {
        type: String,

    },
    success: {
        type: Boolean,
    },
    CustromeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Locations"
    },
    Po_line_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Polines"
    },
    date: {
        type: Date,
        default: Date.now
    },

})

module.exports = mongoose.model('PaymentGetwaya', PaymentSchema)