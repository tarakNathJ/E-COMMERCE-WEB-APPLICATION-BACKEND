// import mongoose to connect database 
const mongoose = require("mongoose");


// import botenv package, to use .env file
require("dotenv").config();


// to creat a function to,stable the connection in your  database
const DatabaseConnest = () => {

    mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,

        }).then(() => console.log("Database connect success fully"))
        .catch((error) => {
            console.log("Database connect  fail in config/DataBaseConnection");
            console.log(error);
            process.exit(1);
        })
}


module.exports = DatabaseConnest;