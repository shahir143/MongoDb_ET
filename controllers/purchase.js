const Order = require('../model/order');
const Razorpay = require('razorpay');
const sequelize = require('../util/database');
const ordersDB = require('../model/order');
const users = require('../model/login');

exports.purchasePremium = async (req, res) => {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    try {
        // initialize the company account
        const rzp = new Razorpay({
            key_id: key_id,
            key_secret: key_secret
        });

        var options = {
            amount: 2500,
            currency: "INR"
        };

        const order = await rzp.orders.create(options);
        // Create the record in the database
        const orderData = await Order.create({
            orderId: order.id,
            status: "PENDING",
            userId: req.user.id,
        });
        return res.status(201).json({ orderData, key_id: rzp.key_id });

    } catch (e) {
        console.log(e);
        res.status(403).json({ success:false, message: "something went wrong", err: e });
    }
};

exports.updateTransactionStatus = async (req, res) => {
    try {
        const {order_id,payment_id}=req.body;

        const orderData = await ordersDB.findOne({ where: { orderId: order_id } });

        if (!orderData) {
            return res.status(400).json({success:false, message: 'Order not found' });
        }
        await sequelize.transaction(async (t) => {
            await Promise.all([
                users.update({ premium: true }, { where: { id: orderData.userId }, transaction: t }),
                ordersDB.update(
                    { paymentId: payment_id, status: "SUCCESS" },
                    { where: { orderId: order_id }, transaction: t }
                )
            ]);
        });
        return res.status(200).json({success:true,  message: 'Transaction status updated successfully' ,data: { Premium: true },});
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.failedTransactions=async(req,res)=>{
    console.log("failed data",req)
    try{
        const orderId = req.body.order_id;
		const paymentId = req.body.payment_id;

        const orderData = await ordersDB.findOne({ where: { orderId: orderId } });

        if (!orderData) {
            return res.status(400).json({success:false, message: 'Order not found' });
        }
        await sequelize.transaction(async (t) => {
            await Promise.all([
                users.update({ premium: false }, { where: { id: orderData.userId }, transaction: t }),
                ordersDB.update(
                    { paymentId: paymentId, status: "FAILED" },
                    { where: { orderId: orderId }, transaction: t }
                )
            ]);
        });

		res.status(200).json({
			message: "Failed to purchase. Initiating rollback",data: { Premium: false },
		});
	}catch (error) {
		res.status(500).json({ message: error.message });
	}

}