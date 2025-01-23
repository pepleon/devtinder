const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
  
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20
    },
    lastName: {
        type: String

    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error("Invalid Email Address");
            }
        }

    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Set a Strong Password");
            }
        }
    }, 
    age: {
        type: Number
    },
    about: {
       type: String,
       default: "This is a default about"
    },

    skills: {
         type: [String],
    },
    gender: {
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        }

    },

    photoURL: {
        type: String,
        default: "https://icon-library.com/images/profile-picture-icon/profile-picture-icon-0.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("URL is not valid");
            }
        }
    }


} , {
    timestamps: true,
});

userSchema.index({firstName: 1, lastName: 1});

userSchema.methods.getJWT = async function () {

   const user = this; 
    

    const token = await jwt.sign({_id: user._id }, "Skibidi@123", {
        expiresIn: "7d"
      });


  return token;    

}



userSchema.methods.validatePassword = async function (password) {
      
    const user = this;

    const isPasswordValid = await bcrypt.compare(password, user.password);
     
    return isPasswordValid;

}



module.exports = mongoose.model("User", userSchema);