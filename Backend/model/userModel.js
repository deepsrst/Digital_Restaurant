const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
 userEmail :{
     type: String,
     required:[true,'userEmail must be provided']
},
userPhoneNumber :
{
    type:Number,
    required:[true,"UserPhonenumber must be provided"]
},
userPassword:
{
    type:String,
    required:[true,""]
},
role:
{
    type:String,
    enum:["customer","admin"],
    default:"customer"
},
isActive:{
    type:Boolean,
    default:true
},
isDisable:
{
    type:Boolean,
    default:false
},
otp:{
    type:Number,
    default:0
},
otpExpiryTime:{
    type:Date
}, 
isOtpVerified:{
type:Boolean,
default:false
},
isOtpUsed:
{
 type:Boolean,
 default:false   
}
})


// userExist[0].otp = otp 
// userExist[0].otpExpiryTime = Date.now() + 10 * 60 * 1000;  // 10 minutes
// userExist[0].isOtpVerified= false;
// userExist.[0].isOtpUsed= false; 

// const User= mongoose.model("UserModel", userSchema)
// module.exports=User

const User = mongoose.model("User",userSchema)
module.exports = User