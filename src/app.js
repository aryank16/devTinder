const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middleware/auth');




app.use(express.json()); 
app.use(cookieParser());

// add a user to database
app.post('/signup', async(req,res)=>{

     
    try {

        // validation of the data received from the client

         validateSignUpData(req);

         const { firstName, lastName, emailId, password } = req.body;



        // hashing the password before saving to database 

        const passwordHash = await bcrypt.hash(req.body.password, 10);
        console.log("Hashed password: ", passwordHash);  
        

        
        // create a new user instance of user model
        const user = new User({

            firstName,
            lastName,
            emailId,
            password: passwordHash,
        } 


        );

        await user.save();
        res.send("User created successfully");
        
    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
    


})


// login user

app.post('/login', async(req,res)=>{

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
            res.send("Login successful");

        }
        else{
            throw new Error("Invalid credentials"); 
        }
        
    } catch (error) {

        res.status(500).send("Login failed: " + error.message)
        
    }
})



// get user by emailId
app.get('/user', async(req,res)=>{

    const userEmail = req.body.emailId;

    try {

        const user = await User.find({emailId: userEmail});
        if (user.length===0) {
            res.status(404).send("User not found");
        } else {
            res.send(user);
        }
        
    } catch (error) {
        res.status(500).send("Error fetching user: " + error.message)
    }
})


// get all users
app.get('/feed', async(req,res)=>{

    try {

        const users = await User.find({});
        res.send(users);
        

    } catch (error) {
        res.status(500).send("Error fetching user: " + error.message)
        
    }

})


//get profiles
app.get('/profile', userAuth, async(req,res)=>{
 
    
    try {

   

    

  

    const user = req.user;
   
    

     
   res.send(user);
    
        
    } catch (error) {

        
        res.status(400).send("Error fetching profile: " + error.message)
    } 
})

//update data of user

app.patch('/user/:userId', async (req,res)=>{
    const userId = req.params.userId;
    const data = req.body;

   
    try {

    const ALLOWED_UPDATES = ["firstName", "lastName", "password", "age", "skills"];

    const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

    if(!isUpdateAllowed){
        // throw new Error("update not allowed")
        throw new Error("Update not allowed")
    }

     const user = await User.findByIdAndUpdate({_id: userId },data, {
        returnDocument: "after",    
        runValidators: true,
            
        });
       
        res.send("User data updated successfully")

        } catch (error) {

         res.status(500).send("Update failed: " + error.message)
        
    }

})







connectDB()
.then(() =>{
    console.log("Database connection established...")
    app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
});
})
.catch((err) =>{
    console.error("Database connection error:", err)
})



