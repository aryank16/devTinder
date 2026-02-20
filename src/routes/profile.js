
const express = require('express');

const { userAuth } = require('../middleware/auth');


const profileRouter = express.Router();



profileRouter.get('/profile', userAuth, async(req,res)=>{
 
    
    try {
       const user = req.user;
   
       res.send(user);
    
        
    } catch (error) {
      
        res.status(400).send("Error fetching profile: " + error.message)
    } 
})

module.exports = profileRouter;
