const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user=new Schema({
    id:{
        type:Number,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    userName:{
        type:String,
        allowNull:false
    },
    userEmail:{
        type:String,
        allowNull:false,
    },
    userPassword:{
        type:String,
        allowNull:false,
    },
    totalexpenses:{
        type:Number,
        default:0,
    },
    premium:{
        type: Boolean,
        default: false
    },
    income:{
        type:Number,
        default:0,
    },    
})

module.exports = mongoose.model("user",user);