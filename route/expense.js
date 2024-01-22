const express=require('express');
const route=express.Router();
const controllerExpense=require('../controllers/expense');
const userAuthorization=require('../middleware/authorize');
const reportController=require('../controllers/report')

route.get('/download',userAuthorization.authorizationToken,reportController.downloadReport);
route.get('/getprevList',userAuthorization.authorizationToken, reportController.getDownlist);

route.delete('/delExpense/:id',userAuthorization.authorizationToken,controllerExpense.deleteData);
route.post('/addExpense',userAuthorization.authorizationToken,controllerExpense.saveData);
route.get('/Expenses',userAuthorization.authorizationToken, controllerExpense.getData);
route.post('/addIncome',userAuthorization.authorizationToken, controllerExpense.saveIncome);
route.get('/paginationExpense',userAuthorization.authorizationToken, controllerExpense.getPageData);


module.exports=route;