const jwt = require ("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next ) => {

try {const cookie = req.cookies;

const {token } = cookie;

if(!token) {
    return res.status(401).send("Please login!");
}

const decodedMessage = jwt.verify(token,process.env.JWT_SECRET)


console.log(decodedMessage);

const {_id} = decodedMessage;

const user = await User.findById(_id);


if(!user){
    throw new Error("User not found");
}

req.user = user;

next();
}
catch(err){
    
    res.status(400).send("Error: "+err.message);
}


};

module.exports = {
    userAuth
};