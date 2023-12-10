const mongoose= require("mongoose")
const User= require("../model/userModel")
const seeder= require("../adminSeeder")
const adminSeeder = require("../adminSeeder")

exports.connectDatabase= async(URL)=>{
    await mongoose.connect(URL)
    console.log("Database Connected Successfully from database.js")
}

adminSeeder();

// admin seeding
// adminSeeder();
// const  isadminExist= await User.findOne({userEmail:"admin@gmail.com"})

// if(!isadminExist)
// {

//     await User.create({
//         userEmail:"admin@gmail.com",
//         userPassword:"admin123",
//         userPhoneNumber:"9840012331"
//     })

//     console.log("Admin seeded successfully")
// }
// else {
//     console.log("Admin already seeded")
// }