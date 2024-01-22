const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const userRoute = require('./route/user');
const expenseRoute=require('./route/expense')
const purchaseRoute=require('./route/purchase')
const premiumRoute=require('./route/premium')
const resetRoute = require('./route/reset');
const mongoose=require('mongoose');

const app = express();

app.use(bodyParser.json());

app.use(cors());
app.use(express.static( "public"));

app.use('/', userRoute);
app.use('/expense', expenseRoute);
app.use('/purchase', purchaseRoute);
app.use('/premium', premiumRoute);
app.use('/password',resetRoute);


// Sync models with the database
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Server started on port 4000');
    app.listen(4000);
}).catch(err => {
    console.error('Error syncing with database:', err);
});
