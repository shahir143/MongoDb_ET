const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expenses =new Schema({
    id:{
        type:Number,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    Expenses:{
        type:Number,
        allowNull:false
    },
    Description:{
        type:String,
        allowNull:false
    }, 
    Category:{
        type:String,
        allowNull:false
    }
})

module.exports = mongoose.model("Expense",expenses);