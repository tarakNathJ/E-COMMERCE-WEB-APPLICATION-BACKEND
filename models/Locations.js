//import mongoose to creat a schema
const mongoose = require("mongoose");


// creat a function to store the user details
const Locations = new mongoose.Schema({
    LocationsType: {
        type: String,
    },
    FirstName: {
        type: String
    },
    LastName: {
        type: String
    },
    InCharge: {
        type: String
    },
    Email: {
        type: String
    },

    Address: {
        type: String
    },
    profitCenter: {
        type: String
    },
    CostCenter: {
        type: String
    },
    token: {
        type: String
    },
    state: {
        type: String,
    },
    Status: {
        type: String
    },
    StatusDate: {
        type: String
    }
})

module.exports = mongoose.model("Locations", Locations);