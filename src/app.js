
const express = require('express');

const connectDB = require('./config/database');

const app = express();

const User = require('./models/user');


app.use(express.json()); 


app.post('/signup', async(req,res)=>{

    console.log(req.body);

    const user = new User(req.body);

     
    try {
        await user.save();
        res.send("User created successfully");
        
    } catch (error) {
        res.status(500).send("Error creating user: " + error.message)
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



