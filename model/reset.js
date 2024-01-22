const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reset =new Schema({
    uuid:{
        type:String,
    },
    isActive:{
        type:Boolean,
        defaultValue:false
    }
})
module.exports = mongoose.model("ResetPassword", reset);