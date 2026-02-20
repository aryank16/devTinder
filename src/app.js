const express = require('express');
const connectDB = require('./config/database');
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');



app.use(express.json()); 
app.use(cookieParser());


const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/requests');


app.use('/auth', authRouter)
app.use('/profile', profileRouter)
app.use('/requests', requestRouter)



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



