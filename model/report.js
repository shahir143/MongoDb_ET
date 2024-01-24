const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const report=new Schema({
    fileUrl:{
        type:String,
    },
    user: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
})

module.exports = mongoose.model("report", report);