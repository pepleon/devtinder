const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
     
     fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true

     },
     
     toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
     },

     status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`,
        }
     }


}, {
    timestamps: true,
});



connectionRequestSchema.pre("save", function (next) {
    connectionRequest = this;

    if (connectionRequest.toUserId.equals(connectionRequest.fromUserId)){
        throw new Error ("You can not send request to yourself");
    }

    next();
})





const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
);



module.exports = ConnectionRequestModel;