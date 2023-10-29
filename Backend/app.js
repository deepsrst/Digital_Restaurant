const express = require("express");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { connectDatabase } = require("./database/databaseConnection");
const app = express()
const User = require("./model/userModel")
require("dotenv").config()
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT

//Database Connection
connectDatabase(process.env.MONGO_URL);

app.get("/", (req, res) => {
    res.status(200).json({
        "message": "I am alive"
    })
})


app.post("/register", async (req, res) => {
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
})

//userlogin
app.post("/login", async (req, res) => {
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
        console.log(userFound[0])
        console.log(`isactive is ${isActive} and isdisable is ${isDisable}`)
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
})

app.listen(PORT, () => {
    console.log(`server has started at ${PORT}`)
})