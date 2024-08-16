const mongoose = require('mongoose');

const InventoryManagementSchema = new mongoose.Schema({
    email: {
        type: String
    },
    token: {
        type: String
    },
    UOM: [{
        type: String
    }],
    SuperAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserActivity'
    },
    FirstSet: [{
        type: String
    }],
    SecondSet: {
        type: Number
    },
    ThirdSet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    ForthSet: {
        type: String
    }
})

module.exports = mongoose.model('InventoryManagement', InventoryManagementSchema);