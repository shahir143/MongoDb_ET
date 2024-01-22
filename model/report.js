const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const report=new Schema({
    fileUrl:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model("report", report);