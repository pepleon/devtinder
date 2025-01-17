const mongoose = require("mongoose");


const connectDB = async () => {



   await mongoose.connect("mongodb+srv://amanbutt:amanbutt@devtinder.qo0jm.mongodb.net/devTinder");

}



module.exports = connectDB;