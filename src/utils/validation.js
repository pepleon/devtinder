const validator = require("validator");

const validateSignUpData = (req) => {
const {firstName, lastName, emailId, password} = req.body;
if (!firstName || !lastName){
    throw new Error("Name is not valid");
}
else if(!validator.isEmail(emailId)){
    throw new Error ("Email is not vaid");
}
else if(!validator.isStrongPassword(password)){
    throw new Error("Please enter a strong password");
}


};

///////////////////////

const validateEditProfileData = (req) => {

    const ALLOWED_UPDATES = [
        "photoURL",
        "about",
        "gender",
        "age",
        "skills",
        "firstName",
        "lastName"
    ];


    const data = req.body;

    const isUpdateAllowed = Object.keys(data).every((k)=> 
        ALLOWED_UPDATES.includes(k)
    
    );
    
    return isUpdateAllowed;



}



const validatePassword = (req) => {

    const password = req;

   if (!validator.isStrongPassword(password)){

    throw new Error("Please enter a strong password");
   }

}





module.exports = {
    validateSignUpData,
    validateEditProfileData,
    validatePassword
}