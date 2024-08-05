const jwt = require("jsonwebtoken");
const UserModel = require("../model/User.model.js");
const crypto = require('crypto');
// const config = require("../configs/")  
require('dotenv').config()
const MustBeSigned = async (req, res, next) => {
    // const userAccessToken = req.headers.token
    const accessTokenKey = crypto.randomBytes(64).toString('base64');
    const googleAccessToken = req.headers.token
  
    try {
        const secretKey = crypto.randomBytes(32).toString('base64');
        const decoded = jwt.verify(googleAccessToken, secretKey)
        res.send({ msd: googleAccessToken, cookie: req.cookies, decoded })
        console.log("decoded value of token : ", decoded)
    } catch (error) {
        console.log("mustbeSigned : ", error.message)
    }


    // if (userAccessToken) {
    //     const decoded = jwt.verify(userAccessToken, accessTokenKey)
    //     console.log(decoded)
    //     if (decoded) {
    //         // req.body.userID = decoded.userID,
    //         //     req.body.userName = decoded.userName
    //         req.body.email = decoded.email,
    //             req.body.password = decoded.password
    //         next()
    //     } else {
    //         res.send("Token doesn't match");
    //     }
    // } else {
    //     res.send({ "msg": "Please Login First!!" })
    // }
}
// admin access 

const isAdmin = async (req, res, next) => {
    try {
        console.log(req)
        const user = await UserModel.findById(req.user._id)
        if (user.role !== 1) {
            return res.status(401).send({
                success: false,
                message: 'You are not allowed'
            })
        } else {
            next()
        }

    } catch (error) {
        res.send({ message: "Error" })
    }

}
module.exports = { isAdmin, MustBeSigned }