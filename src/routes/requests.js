const express = require('express');
const { userAuth } = require('../middleware/auth');

const requestRouter = express.Router();

requestRouter.get('/requests', userAuth, async(req,res)=>{

   const user = req.user;

   

   res.send(user.firstName)


})


module.exports = requestRouter;