const express = require("express");
const authRouter = express.Router();
const {validateSignUpData} = require("../utils/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");


authRouter.post("/signup", async (req,res)=>{
    // Validation of data
    try {
    
    validateSignUpData(req);
    
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password,10);
    console.log(passwordHash)
    
    const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
    });
    
    
        
    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    
    

       res.cookie("token", token );

    res.json({message: "User Added",
        data: savedUser,
    });
    
    }
    catch(err){
        res.status(400).send("Error saving the data: "+err.message);
    }
    
    })
    


authRouter.post("/login", async (req, res) => {
    
    try {
    
    const {emailId, password} = req.body;
    
    if (!validator.isEmail(emailId)){
        throw new Error("Invalid credentials");
    }
    
    const user = await User.findOne({emailId: emailId});
    
    if (!user){
        throw new Error("Invalid Credentials");
    }
    
    
    const isPasswordValid = await user.validatePassword(password);

    console.log(isPasswordValid);
    
    if (isPasswordValid){
    
    
      const token = await user.getJWT();
    
    
    
    
    
       res.cookie("token", token );
        res.send(user);
    
    }
    else {
        throw new Error("Password is not correct");
    }
    
    }
    catch(err) {
          res.status(400).send("Something went wrong: "+ err.message);
    
    }
    
    });
    


authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });

    res.send("LogOut Successful!!");

});



 module.exports = authRouter;