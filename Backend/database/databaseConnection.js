const mongoose= require("mongoose")

exports.connectDatabase= async(URL)=>{
    await mongoose.connect(URL)
    console.log("Database Connected Successfully from database.js")
}


