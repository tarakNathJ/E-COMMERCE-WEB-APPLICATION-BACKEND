const express = require('express');
const Router = express.Router();


const { auth, isCustromer } = require('../Middleware/Auth');
const { ReturnOrder } = require('../Controllers/SalesManagement');


Router.post('/Supplier', auth, isCustromer, ReturnOrder);

module.exports = Router;