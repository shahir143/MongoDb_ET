const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const order=new Schema({
    id:{
        type:Number,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    paymentId:String,
    orderId:String,
    status:String,
    user: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
})

module.exports = mongoose.model("Order",order);