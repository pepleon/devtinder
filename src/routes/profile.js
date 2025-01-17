const express = require ("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const {validateEditProfileData, validatePassword} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");



profileRouter.get("/profile/view",userAuth, async (req,res)=> {
 

    try    { 
    
    
    const user = req.user;
    
     res.send(user);
    
    }
    catch(err){
    
        res.status(400).send("Error: "+err.message);
    
    }
    
      
    
    });
    


profileRouter.patch("/profile/edit",userAuth, async (req,res) => {

    


try {

  const data = req.body;
  const isUpdateAllowed = validateEditProfileData(req);    

    if (!isUpdateAllowed){
        throw new Error("User can not be updated");
    }


   if(data?.firstName?.length<4) {
    throw new Error("Please enter name more than 4 letters");
}

    if (data?.skills?.length>10){
    throw new Error("Skills cannot be more than 10");
}




   const user = req.user;

   Object.keys(req.body).forEach((key)=>{
     user[key] = req.body[key];
   });



/*
   await User.findByIdAndUpdate({_id: user._id}, data ,{
           returnDocument: "after",
           runValidators:true,
       });

 */

    await user.save();
    res.json(
        {Message: "User Updated Successfully!!",
        data: data,  
}
    );
}

catch(err){

    console.error(err); 
    res.status(400).send(err);
}

});



profileRouter.patch("/profile/password",userAuth, async(req,res) => {

try{



const password = req.body.password;   

console.log(password);
validatePassword(password);    

const user = req.user;

const hashPassword = await bcrypt.hash(password, 10);

user.password = hashPassword;

await user.save();

res.send("Password Changed!!");

}
catch(err){

    res.status(400).send("Error: "+err);
}

});




module.exports = profileRouter;

