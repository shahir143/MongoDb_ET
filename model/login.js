const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const user=sequelize.define('users',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    userName:{
        type:Sequelize.STRING,
        allowNull:false
    },
    userEmail:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    userPassword:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    totalexpenses:{
        type:Sequelize.INTEGER,
        defaultValue:0,
    },
    premium:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    income:{
        type:Sequelize.INTEGER,
        defaultValue:0,
    },    
})

module.exports=user;