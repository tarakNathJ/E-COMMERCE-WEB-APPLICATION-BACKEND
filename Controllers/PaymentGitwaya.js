const crypto = require('crypto');
const RazorpayInstance = require('../Config/RezorPay');
const PaymentGitway = require('../models/PaymentGitwaya');

// Payment Gitwaya for razorpay

require('dotenv').config();
// ROUTE 1 : Create Order Api 



exports.RazorpayPaymentOrder = async(req, res) => {
    const { Amount } = req.body;


    try {
        const Option = {
            amount: Number(Amount * 100),
            currency: "INR",
            receipt: crypto.randomBytes(10).toString('hex'),

        }
        const Key = process.env.RAZORPAY_KEY
        if (!Key) {
            return res.status(400).json({
                success: false,
                message: "key are not exit",
            })
        }
        RazorpayInstance.orders.create(Option, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({
                    success: false,
                    message: "Something Went Wrong ! to creating Order in Payment Gatway"
                })
            }

            res.status(200).json({
                success: true,
                message: "Order create success fully ",
                data: order,
                ApiKey: Key,
            })
        })


    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal Server Error! in PaymentGitway"
        });

    }
}


// ROUTE 2 : create verify api 

exports.RazorpayPaymmentVerify = async(req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    try {

        // Create Sign
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        // Create ExpectedSign
        const expectedSign = crypto.createHmac("sha256", process.env.key_secret).update(sign.toString()).digest("hex");

        // create isAuthentic 
        const isAuthentic = expectedSign == razorpay_signature;

        // conditon chack
        if (isAuthentic) {


            const SavePaymentResept = await PaymentGitway.create({
                razorpay_order_id: razorpay_order_id,
                razorpay_payment_id: razorpay_payment_id,
                razorpay_signature: razorpay_signature
            })


            res.status(200).json({
                success: true,
                message: "Payment successfull ",
                SavePaymentResept,
            })

        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        });


    }

}