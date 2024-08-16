const express = require('express');

const Router = express.Router();

const { RazorpayPaymentOrder, RazorpayPaymmentVerify } = require('../Controllers/PaymentGitwaya');


Router.post('/order', RazorpayPaymentOrder);
Router.post('/verify', RazorpayPaymmentVerify);

module.exports = Router;