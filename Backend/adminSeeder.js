const User = require("./model/userModel")
const bcrypt= require("bcryptjs")

const adminSeeder = async()=>
{
// admin seeding

const isadminExist = await User.findOne({userEmail:"admin@gmail.com"})
 if(!isadminExist)
 {
    await User.create({

        userEmail:"admin@gmail.com",
        userPassword:bcrypt.hashSync("admin",10),
        userPhoneNumber:"9840015785",
        userName:"admin",
        role:"admin"
    })

    console.log("Admin seeded Successfully")
 }
 else
 {
    console.log("Admin already seeded")
 }
}

module.exports = adminSeeder