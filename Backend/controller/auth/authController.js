const User = require("../../model/userModel")

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const sendEmail= require("../../services/sendEmail")
//registeruser
exports.registerUser  = async (req, res) => {
    const { email, password, phoneNumber, userName } = req.body

    //check if all fields are passed or not
    if (!email || !password || !phoneNumber || !userName) {
        return res.status(400).json({
            message: "please provide username, phoneNumber, email and password"
        })
    }

    //check if the email user alreayd existed or not

    const userFound = await User.find({ userEmail: email })
    if (userFound.length > 0) {
        return res.status(400).json({
            message: "User with the given email already registered"
        })
    }

    // if all okay, then create

    await User.create({
        userName: userName,
        userPhoneNumber: phoneNumber,
        userEmail: email,
        userPassword: bcrypt.hashSync(password, 12)
    })

    return res.status(201).json({
        message: "user registered successfully"
    })
}

//login
exports.login  = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            message: "please provide email and password"
        })
    }

    //check if the given email exist or not
    const userFound = await User.find({ userEmail: email })

    if (userFound.length == 0) {
        return res.status(404).json({
            message: "provided email is not registered"
        })
    }

    //compare password 
    const isPasswordMatched = bcrypt.compareSync(password, userFound[0].userPassword)
    if (!isPasswordMatched) {
        return res.status(404).json({
            message: "incorrect password"
        })
    }
        // false, true
        const {isActive, isDisable} = userFound[0]
        // console.log(userFound[0])
        // console.log(`isactive is ${isActive} and isdisable is ${isDisable}`)
    if(!userFound[0].isActive  || userFound[0].isDisable)
    {
       const message= `User is ${!isActive ? 'inactive' : ''}${!isActive && isDisable ? ' and ' : ''}${isDisable ? 'disabled' : ''}.`;
    return res.status(401).json({
        message:message
    })
    }

    //generate token 
    const jwtToken= jwt.sign({id:userFound[0]._id}, process.env.SECRET_KEY,{expiresIn:"30d"})
    console.log(jwtToken)
    return res.status(200).json({
        message:"user logged in successfully",
        jwtToken
    })
}


exports.forgotPassword= async(req,res) =>{

    const{email} = req.body
    if(!email)
    {
        return res.json(400).json({
            message:"please provide email address"
        })
    }
 console.log("before find")
    // check if the provided email exists or not.
     const userExist= await User.find({userEmail:email})
     console.log("after find")
     if((await userExist).length== 0)
     {
        return res.status(404).json({
            message:"Email doesn't exist."
        })
     }

     //email exist
     //generate OTP and send to email address
     const otp = Math.floor(1000 + Math.random() * 9000);
  
     userExist[0].otp = otp
     userExist[0].otpExpiryTime = Date.now() + 1 * 60 * 1000;  // 10 minutes
     userExist[0].isOtpVerified = false;
     userExist[0].isOtpUsed= false; 
     console.log("before save")
     await userExist[0].save()
     console.log("after save")
     await sendEmail({
         email :email,
         subject : "OTP for Password Reset.",
         message : `Your otp is ${otp} . Dont share with anyone`
     })
     res.status(200).json({
         message : "OTP sent successfully"
     })
     console.log("after send email")
}


// verify the OTP along with Email 
exports.veriyOTP= async (req,res)=>{
    const{email,otp} = req.body
    if(!email  || !otp)
    {
        return res.status(400).json({
            message:"please provide email and OTP"
        })
    }

    // verify the provide otp

    const userExists= await User.find({userEmail:email});
    if((await userExists).length ==0)
    {
        return res.status(404).json({
            message:"email not registered"
        })
    }

    const currentTime = Date.now();
  if (currentTime > userExists[0].otpExpiryTime) {
  return  res.status(400).send('OTP has expired.');
  }

  if(userExists[0].otp !== otp)
  {
    return res.status(400).json({
        message:"Incorrect OTP"
    })
  }

  userExists[0].isOtpVerified=true;
  await userExists[0].save()
  return res.status(200).json({
    message:"OTP Verified. Reset your password."
  })
}


exports.resetPassword = async(req,res)=>{
    const {otp,email,newPassword,confirmPassword} = req.body

    if(!otp || !email || !newPassword || !confirmPassword){
        return res.status(400).json({
            message : "Please provide otp, email, newPassword, confirmPassword"
        })
    }
    if(newPassword !== confirmPassword){
        return res.status(400).json({
            message : "newPassword and confirmPassword doesn't match"
        })
    }

    const userExists = await User.find({userEmail:email})
    if(userExists.length == 0){
        return res.status(404).json({
            message : "User email not registered"
        })
    }

    const currentTime = Date.now();
    if (currentTime > userExists[0].otpExpiryTime) {
    return  res.status(400).send('OTP has expired.');
    }
  
    if(userExists[0].otp !== otp)
    {
      return res.status(400).json({
          message:"Incorrect OTP"
      })
    }

    if(!userExists[0].isOtpVerified)
    {
        return  res.status(400).json({
            message:"OTP not Verified."
        })
    }

    if(userExists[0].isOtpUsed)
    {
        return res.json(400).json({
            message:"OTP already used. Action can't be performed."
        })
    }

    userExists[0].userPassword = bcrypt.hashSync(newPassword,10)
    userExists[0].isOtpUsed=true;
    await userExists[0].save()

    res.status(200).json({
        message : "Password changed successfully"
    })
    
}