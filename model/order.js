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
})

module.exports = mongoose.model("Order",order);