const express = require("express");
const DatabaseConnestion = require("./Config/DataBaseConnection");
const routers = require("./Routes/Route");
const ProductRouter = require("./Routes/ProductManagerRouter");
const InventoryRouter = require("./Routes/InventoryManagement");
const PaymentIntegration = require('./Routes/PaymentIntegration');
const cookieparser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const { api } = require("./Config/Cloudinary");

const app = express();


// import env file
require("dotenv").config();

// 
app.use(express.json());
app.use(cookieparser());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/v1/user", routers);
app.use("/api/v1/productManager", ProductRouter);
app.use("/api/v1/inventoryManager", InventoryRouter);
app.use("/api/v1/paymentGetway", PaymentIntegration);


// connection stable in your data base
DatabaseConnestion();

//server start 
app.listen(process.env.PORT, () => {
    console.log("server start successfully");
})

app.get('/', (req, res) => {
    return res.send("hello");
})