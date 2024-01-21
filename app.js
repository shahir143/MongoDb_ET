const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const userRoute = require('./routers/user');
const expenseRoute=require('./routers/expense')
const purchaseRoute=require('./routers/purchase')
const premiumRoute=require('./routers/premium')
const resetRoute = require('./routers/reset');

const sequelize = require("./util/database");
const expense=require('./model/expense');
const loginUser =require('./model/login');
const order = require('./model/order');
const reset=require('./model/reset');
const report=require('./model/report');

const app = express();

app.use(bodyParser.json());

app.use(cors());
app.use(express.static( "public"));

app.use('/', userRoute);
app.use('/expense', expenseRoute);
app.use('/purchase', purchaseRoute);
app.use('/premium', premiumRoute);
app.use('/password',resetRoute);


loginUser.hasMany(expense);
expense.belongsTo(loginUser);

loginUser.hasMany(order)
order.belongsTo(loginUser)

loginUser.hasMany(reset)
reset.belongsTo(loginUser)

loginUser.hasMany(report);
report.belongsTo(loginUser);

// Sync models with the database
sequelize.sync().then(() => {
    console.log('Server started on port 4000 in Jenkins');
    app.listen(4000);
}).catch(err => {
    console.error('Error syncing with database:', err);
});
