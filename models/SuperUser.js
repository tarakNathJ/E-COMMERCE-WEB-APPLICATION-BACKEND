const mongoose = require('mongoose');

const SuperUserSchema = new mongoose.Schema({
    email: {
        type: String
    },
    token: {
        type: String

    },
    AllManagerData: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserActivity"
    }],
    LicenseNumber: [{
        type: String
    }]

})
module.exports = mongoose.model("SuperUsers", SuperUserSchema)