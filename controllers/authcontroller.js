const JWT = require("jsonwebtoken");
const UserModel = require("../model/User.model");
require('dotenv').config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const userModel = require("../model/User.model")
const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        //validations
        if (!name) {
            return res.send({ error: "Name is Required" });
        }
        if (!email) {
            return res.send({ error: "Email is Required" });
        }
        if (!password) {
            return res.send({ error: "Password is Required" });
        }
        if (!phone) {
            return res.send({ error: "Phone no is Required" });
        }
        if (!address) {
            return res.send({ error: "Address is Required" });
        }
        //check user
        const exisitingUser = await UserModel.findOne({ email: req.body.email });
        //exisiting user
        if (exisitingUser) {
            return res.status(200).send({
                success: false,
                message: "Already Registered with the email please login",
            });
        }

        //register user
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)
        const hashedPassword = await hashPassword(password);
        //save
        const user = await new UserModel({ name, email, phone, address, password: secPass, hashedPassword, role: "user" });

        await user.save()
        // const token =  JWT.sign({ userID: user._id, userName: user.name }, "Cart", {
        //     expiresIn: "7d",
        // });
        res.status(200).send({
            success: true,
            message: "User Register Successfully",
            user: user,
            // token
        });
    } catch (error) {
        console.log(error.message);
        // res.status(500).send({
        //     success: false,
        //     message: "Error in Registeration",
        //     // error.message,
        // });
        if (error.code === 11000) {
            // Handle duplicate key error
            res.status(400).send({
                success: false,
                message: "Email already exists. Please login.",
            });
        } else {  
            console.log(error.message);  
            res.status(500).send({
                success: false,
                message: "Error in Registration",
            });
        }
    }
};

//POST LOGIN
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log("from body", JSON.stringify(email))
        //check user
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registerd",
            });
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(404).send({
                success: false,
                message: "Invalid Password",
            });
        }
        let userDatas = {
            email,
            password
        }
        // const token = JWT.sign({ userID: user._id, userName: user.name }, "Cart", { expiresIn: "7d" });
        //token   
        const accessTokenKey = crypto.randomBytes(32).toString('base64');
        const refreshTokenKey = crypto.randomBytes(32).toString('base64');
        const userAccessToken = jwt.sign(userDatas, accessTokenKey, { expiresIn: "15h" })
        const refreshToken = jwt.sign(userDatas, refreshTokenKey);
        res.cookie('accessToken', userAccessToken, { sameSite: 'none', httpOnly: true, secure: true });
        // Verify access token
        function verifyAccessToken(tokens) {
            try {
                const decoded = jwt.verify(tokens, accessTokenKey);
                return decoded;
            } catch (error) {
                console.error('Access token verification failed:', error.message);
                return null;
            }
        }
        // Verify refresh token
        function verifyRefreshToken(tokens) {
            try {
                const decoded = jwt.verify(tokens, refreshTokenKey);
                return decoded;
            } catch (error) {
                console.error('Refresh token verification failed:', error.message);
                return null;
            }
        }
        const decodedAccessToken = verifyAccessToken(userAccessToken);
        if (decodedAccessToken) {
            // console.log('Access token decoded:', decodedAccessToken);
            // next();  
        }

        const decodedRefreshToken = verifyRefreshToken(refreshToken);
        if (decodedRefreshToken) {
            // console.log('Refresh token decoded:', decodedRefreshToken);
        }
        return res.status(200).send({
            success: true,
            message: "login successfully",
            user,
            // token,
            userAccessToken
        });
    } catch (error) {
        console.log(error);
        // console.log("not logged in : ")
        return res.status(500).send({
            success: false,
            message: "Error in login",
            error,
        });
    }
};

const updationController = async (req, res) => {
    const { email, firstname, phoneNumber, userID } = req.body;
    const userDatas = { email, firstname, phoneNumber, userID }

    // const users = await userModel.findOne({ "users data":email })
    const users = await userModel.findById(req.body)
    res.send(users)
    // const updatedUser = await userModel.findByIdAndUpdate(userID, { firstname, email, phoneNumber }, { new: true })
    // res.json(updatedUser)  
    // res.status(200).json(userDatas)
};

const testController = (req, res) => {
    try {
        res.send("Protected Routes");
        res.cookie("googleAccessCookie", true, { maxAge: 1200000, httpOnly: true, secure: true });
    } catch (error) {
        console.log(error);
        res.send({ error });
    }
};

const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;
        if (!email) {
            res.status(400).send({ message: "Emai is required" });
        }
        if (!answer) {
            res.status(400).send({ message: "answer is required" });
        }
        if (!newPassword) {
            res.status(400).send({ message: "New Password is required" });
        }
        //check
        const user = await UserModel.findOne({ email });
        //validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Wrong Email Or Answer",
            });
        }
        const hashed = await hashPassword(newPassword);
        await UserModel.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully",
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            success: false,
            message: `Something went wrong ${error.message}`,
            error,
        });
    }
};

const hashPassword = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        return hashedPassword
    } catch (error) {
        console.log("Error hashing password")
    }
};

const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword)
};

module.exports = { registerController, loginController, testController, forgotPasswordController, updationController }