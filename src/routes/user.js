const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();



userRouter.get("/user/requests/received", userAuth, async (req, res) => {

 try{

    const loggedInUser = req.user;
    const data = await ConnectionRequestModel.find({
      $and: [{toUserId: loggedInUser._id},
        {status: "interested"}
      ]  
    }).populate("fromUserId", ["firstName", "lastName", "about", "age","gender", "photoURL", "skills"])

    res.json({
        Message: "Data fetched successfully!!",
        data
    })


 }
 catch(err){
    res.status(400).send("Error: "+err.message);
 }

});


userRouter.get("/user/connections", userAuth, async (req, res) => {

try{

    const loggedInUser = req.user;

    const connections = await ConnectionRequestModel.find({
       $or: [
        {toUserId: loggedInUser._id, status: "accepted"},
        {fromUserId: loggedInUser._id, status: "accepted"}

       ] 
    }).populate("fromUserId", "firstName lastName photoURL age skills gender about").
    populate("toUserId", "firstName lastName photoURL age skills gender about")

    const data = connections.map((data)=> {
        if (data.fromUserId._id.toString() === loggedInUser._id.toString()){
           return data.toUserId

        }
        else return data.fromUserId
       
    
    })

    res.json({
     data: data
    })


}
catch(err){

    res.status(400).send("Error: "+err.message);
}


});


userRouter.get("/feed", userAuth, async (req, res) => {

try {

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page-1)*limit;


const loggedInUser = req.user;

const connectionRequests = await ConnectionRequestModel.find({
$or: [
    {toUserId: loggedInUser._id},
    {fromUserId: loggedInUser._id}
]

}).select("fromUserId toUserId")

const hideUsersFromFeed = new Set();

connectionRequests.forEach(
    (req) => {
    hideUsersFromFeed.add(req.fromUserId.toString());
    hideUsersFromFeed.add(req.toUserId.toString());

    }
);


const users = await User.find({

    $and: [ 
      {_id: {$nin: Array.from(hideUsersFromFeed)}},
      {_id: {$ne: loggedInUser._id }}

    ]

}).select("firstName lastName photoURL age skills gender about").
skip(skip).
limit(limit);


console.log(hideUsersFromFeed);
res.send(users);

}

catch(err) {

    res.status(400).send("Error: "+err.message);
}


});









module.exports  = userRouter;