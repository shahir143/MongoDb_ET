const Order = require('../model/order');
const Razorpay = require('razorpay');
const mongoose = require("mongoose");
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
        // Create the record in the database
        const orderData = await Order.create({
            orderId: order.id,
            status: "PENDING",
            user: req.user._id,
        });
		
        return res.status(201).json({ orderData, key_id: rzp.key_id });

    } catch (e) {
        console.log(e);
        res.status(403).json({ success: false, message: "something went wrong", err: e });
    }
};

exports.updateTransactionStatus = async (req, res) => {
    try {
        const session = await mongoose.startSession();
	    session.startTransaction();


		const orderId = req.body.order_id;
		const paymentId=req.body.payment_id;

		// Find the order using Mongoose
		const orderData = await Order.findOne({ orderId }, null, { session });
		

        if (!orderData) {
            await session.abortTransaction();
			session.endSession();
            return res.status(400).json({success:false, message: 'Order not found' });
        }
        const status = orderData.status;

		if (status === "PENDING") {
			// Update the order status
			await Order.updateOne(
				{ orderId },
				{
					paymentId: paymentId,
					status: "SUCCESS",
				},
				{ session },
			);

			// Update user's premium status
			await users.updateOne(
				{ _id: orderData.user },
				{
					premium: true,
				},
				{ session },
			);

			await session.commitTransaction();
			session.endSession();
			
			return res.status(200).json({success:true,  message: 'status updated successfully' ,data: { Premium: true },});
    
		} else {
			// Handle the case where the status is not "PENDING"
			await session.abortTransaction();
			session.endSession();

			return res.status(400).json({
				message: "Order status is not PENDING",
			});
		}
        } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.failedTransactions=async(req,res)=>{
    console.log("failed data",req)
    try{
        const session = await mongoose.startSession();
	    session.startTransaction();

        const orderId = req.body.order_id;
		const paymentId = req.body.payment_id;

        await Order.updateOne(
			{ orderId },
			{
				paymentId,
				status: "FAILED",
			},
			{ session },
		);

		// Update user's premium status to "false"
		await users.updateOne(
			{ _id: req.user._id },
			{
				isPremium: false,
			},
			{ session },
		);

		await session.commitTransaction();
		session.endSession();

		res.status(200).json({
			message: "Failed to purchase. Initiating rollback",data: { Premium: false },
		});
	}catch (error) {
		res.status(500).json({ message: error.message });
	}

}