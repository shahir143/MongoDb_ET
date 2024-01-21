const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const reset =sequelize.define('resetpassword',{
    uuid:{
        type:Sequelize.STRING,
    },
    isActive:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
    }
})
module.exports=reset;