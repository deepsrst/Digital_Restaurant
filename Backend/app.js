const express = require("express");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { connectDatabase } = require("./database/databaseConnection");
const app = express()
const User = require("./model/userModel")
const authRoute= require("./routes/authRoute")
const productRoute = require("./routes/productRoute")
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


// app.post("/register", async (req, res) => {
//     const { email, password, phoneNumber, userName } = req.body

//     //check if all fields are passed or not
//     if (!email || !password || !phoneNumber || !userName) {
//         return res.status(400).json({
//             message: "please provide username, phoneNumber, email and password"
//         })
//     }

//     //check if the email user alreayd existed or not

//     const userFound = await User.find({ userEmail: email })
//     if (userFound.length > 0) {
//         return res.status(400).json({
//             message: "User with the given email already registered"
//         })
//     }

//     // if all okay, then create

//     await User.create({
//         userName: userName,
//         userPhoneNumber: phoneNumber,
//         userEmail: email,
//         userPassword: bcrypt.hashSync(password, 12)
//     })

//     return res.status(201).json({
//         message: "user registered successfully"
//     })
// })

//userlogin
// app.post("/login", )

// Forget Password



app.use("/api",authRoute)
app.use("/api",productRoute)

app.listen(PORT, () => {
    console.log(`server has started at ${PORT}`)
})