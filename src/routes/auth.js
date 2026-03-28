const express = require('express');

const authRouter = express.Router();
const { validateSignUpData } = require('../utils/validation');
const User = require('../models/user');
const bcrypt = require('bcrypt');


authRouter.post('/signup', async(req,res)=>{

     
    try {

        // validation of the data received from the client

         validateSignUpData(req);

         

         const { firstName, lastName, emailId, password,age } = req.body;



        // hashing the password before saving to database 

        const passwordHash = await bcrypt.hash(req.body.password, 10);
        
        

        
        // create a new user instance of user model
        const user = new User({

            firstName,
            lastName,
            emailId,
            password: passwordHash,
            age
        } 


        );
        const savedUser = await user.save();
        const token = await savedUser.getJWT();
            // add the token to the cookie and send response to client
            res.cookie('token', token,{
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set cookie to expire in 7 days
            })
           

       
        res.json({message:"User created successfully", data:savedUser});
        
    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
    



}); 



// login user
authRouter.post('/login', async(req,res)=>{

    try {

        const { emailId, password } = req.body;

        const user = await User.findOne({emailId: emailId});

        if (!user){
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid){

            //create a JWT token

            const token = await user.getJWT();
           





            // add the token to the cookie and send response to client
            res.cookie('token', token)
            res.send(user);

        }
        else{
            throw new Error("Invalid credentials"); 
        }
        
    } catch (error) {

        res.status(500).send("Login failed: " + error.message)
        
    }
})


// logout user

authRouter.post('/logout', (req,res)=>{

    res.clearCookie('token');
    res.send("Logout successful");
})

module.exports = authRouter;