const Sequelize=require('sequelize');
const schema=process.env.AWS_DB_NAME;
const userName=process.env.AWS_DB_USERNAME;
const userPassword=process.env.AWS_DB_PASSWORD;
const db_host=process.env.AWS_DB_HOST;


const sequelize=new Sequelize(schema,userName,userPassword,{
    dialect:'mysql',
    host:db_host,
})

module.exports = sequelize;
