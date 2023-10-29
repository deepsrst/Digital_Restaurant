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
}
})


// const User= mongoose.model("UserModel", userSchema)
// module.exports=User

const User = mongoose.model("User",userSchema)
module.exports = User