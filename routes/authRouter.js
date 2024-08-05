const express = require('express');
// const { forgotPasswordController, loginController, registerController, testController } = require('../controllers/authController')
const { MustBeSigned } = require('../middleware/authenticate');
const { forgotPasswordController, loginController, registerController, testController,updationController } = require('../controllers/authcontroller');
const authrouter = express.Router();

authrouter.post("/register", registerController);

authrouter.post("/login", loginController);

authrouter.patch('/profile',updationController);

authrouter.post("/forget-password", forgotPasswordController);  

authrouter.get("/test", MustBeSigned, testController);

authrouter.get("/user-auth", MustBeSigned, (req, res) => {
    res.status(200).send({ ok: true });
})

//protected Admin route auth
// authrouter.get("/admin-auth", MustBeSigned, isAdmin, (req, res) => {
//     res.status(200).send({ ok: true });
// });

// export default authrouter
module.exports = { authrouter }