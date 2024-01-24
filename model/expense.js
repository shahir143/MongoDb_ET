const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expenses =new Schema({    
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
    },
    user: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
})

module.exports = mongoose.model("Expense",expenses);