const mongoose = require("mongoose");


const connectDB = async () => {



   await mongoose.connect(process.env.ConnectMongoDB);

}



module.exports = connectDB;