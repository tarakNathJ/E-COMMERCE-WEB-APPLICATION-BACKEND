const mongoose = require('mongoose');

const InventoryManagementSchema = new  mongoose.Schema({
    email:{
        type:String
    },
    token:{
        type:String
    },
    AllSeller_Id:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserActivity'
    }]
}) 

module.exports = mongoose.model('InventoryManagement',InventoryManagementSchema);