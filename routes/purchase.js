const express=require('express');
const route=express.Router();
const authorize=require('../middleware/authorize');
const purchaseController=require('../controllers/purchase');

route.get('/premiumMember',authorize.authorizationToken,purchaseController.purchasePremium)
route.post('/updatedTransactionstatus',authorize.authorizationToken,purchaseController.updateTransactionStatus)
route.post('/failedTransaction',authorize.authorizationToken,purchaseController.failedTransactions);

module.exports=route;