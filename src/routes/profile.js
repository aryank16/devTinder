
const express = require('express');

const { userAuth } = require('../middleware/auth');
const { validateEditProfileData } = require('../utils/validation');
const bcrypt = require('bcrypt');


const profileRouter = express.Router();



profileRouter.get('/profile/view', userAuth, async(req,res)=>{
 
    
    try {
       const user = req.user;
   
       res.send(user);
    
        
    } catch (error) {
      
        res.status(400).send("Error fetching profile: " + error.message)
    } 
})


profileRouter.patch('/profile/edit', userAuth, async(req,res)=>{
 
    
    try {
      
        if (!validateEditProfileData(req)) {

            throw new Error("Invalid edit request");
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key]= req.body[key]));

        await loggedInUser.save();

        res.json({
            
            message: `${loggedInUser.firstName} your Profile updated successfully`,
            data: loggedInUser,
        });
    
        
    } catch (error) {
      
        res.status(400).send("Error fetching profile: " + error.message)
    } 
})


profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    
  try {
    
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Both currentPassword and newPassword are required",
      });
    }

    const user = req.user;

    // Compare current password
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({
      message: "Password updated successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating password",
      error: error.message,
    });
  }
});

module.exports = profileRouter;
