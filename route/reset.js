const express=require('express');
const route=express.Router();

const resetController=require('../controllers/reset');

route.post('/forgetPassword',resetController.forgetPassword);
route.get(`/resetpassword/:id`,resetController.resetPassword);
route.post(`/resetpassword/:id`,resetController.updatePassword);

module.exports=route;