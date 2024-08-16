const mongoose = require('mongoose');

const SuperUserSchema = new mongoose.Schema({
    location_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Locations"
    },
    Name: {
        type: String,
    },
    UpcommingOrder: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variants"

    }],
    Status: {
        type: String
    },
    StatusDate: {
        type: Date,
        default: Date.now()
    }

})
module.exports = mongoose.model("SuperUser", SuperUserSchema)