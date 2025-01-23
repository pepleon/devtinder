const { subDays, startOfDay, endOfDay } = require("date-fns");
const cron = require("node-cron");
const ConnectionRequestModel = require("../models/connectionRequest");
const user = require("../models/user");
const sendEmail = require("./sendEmail");
 

// cron.schedule("35 14 * * *", async ()=>{

//     try{

//     const yesterday = subDays(new Date(), 1);
//     const yesterdayStart = startOfDay(yesterday);
//     const yesterdayEnd = endOfDay(yesterday);

//      const pendingRequest = await ConnectionRequestModel.find({
//         status: "interested",
//         createdAt: {
//             $gte: yesterdayStart,
//             $lt: yesterdayEnd
//         }

//      }).populate("fromUserId toUserId");

//     const listOfEmails = [... new Set(pendingRequest.map((user)=> user.toUserId.emailId))];

//     for( const email of listOfEmails){

//        try { 
//             const res = await sendEmail.run("New friend request pending "+email,"There are so many friend rquest pending login to the portal devtinder.tech and accept or reject the rueqests");
            

//         }
//         catch(err){
//             console.error(err.message);
//         }
//     }



//     }
//     catch(err) {
//         console.log(err.message);
//     }
    
// });