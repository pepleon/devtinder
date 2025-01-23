const express = require("express");
const connectDB = require ("./config/database");
const User = require("./models/user");
const app = express();
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth");
const cors = require("cors");
require("dotenv").config();
require("./utils/cronjob");
const http = require("http");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());



const authRouter = require("./routes/auth");
const requestRouter = require("./routes/request");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");



app.use("/", authRouter);
app.use("/",requestRouter);
app.use("/", profileRouter);
app.use("/",userRouter);
app.use("/",chatRouter);







const server = http.createServer(app);

initializeSocket(server);








app.get("/user", async (req,res) => {

const userEmail = req.body.emailId;

try{

    const user = await User.find({});
    if(user.length===0) {
        res.status(400).send("User not found");
    }
    else{res.send(user);}
    


}
catch(err){
    res.status(400).send("Something went wrong");
}



})



app.delete("/user", async (req,res)=> {

const userId = req.body.userId;

try {

    await User.findByIdAndDelete(userId);
    res.send("User deleted");

}
catch (err) {
res.status(400).send("Something went wrong "+err);

}

})




// Update user

app.patch("/user/:userId",userAuth, async (req,res)=> {

const userId = req.params?.userId;
const data = req.body;

try {

const ALLOWED_UPDATES = [
    "photoURL",
    "about",
    "gender",
    "age",
    "skills",
    "firstName",
    "lastName"
];

const isUpdateAllowed = Object.keys(data).every((k)=> 
    ALLOWED_UPDATES.includes(k)

);
if (!isUpdateAllowed){
    throw new Error("User can not be updated");
}


   await User.findByIdAndUpdate({_id: userId}, data ,{
        returnDocument: "after",
        runValidators:true,
    });
    res.send("User Updated");
}

catch(err){

    console.error(err); 
    res.status(400).send({ error: err.message });
}

})







connectDB().then(
    () => {
        console.log("Database connected");
   
        server.listen(process.env.PORT, ()=> {
            console.log("Server is successfully started");
        });
   
    }
).catch(err => {
    console.error("Database cannot be connected");
})




