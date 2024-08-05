const connectedToMongodb = require("./configs/db")
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require("passport")
// const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
// var colors = require('colors');
const { indexRouter } = require("./routes");
const session = require("express-session")
const app = express();
const port = 5000;
app.use(express.json());
require('dotenv').config();
// const stripe = require("stripe")("sk_test_51OeyPQSDGsRHH0YWQYUx41ffXedv8HHcyg7jqRb2RnTERWsfXG7MgD9uhC9Q3pkwHBe5LghlZdwfvnl5B4aiHs1h00yyPkJM1b")
connectedToMongodb();




// Use cookie-parser middleware to parse cookies
app.use(cookieParser());

app.use(cors({
    origin: true,
    methods: "GET ,POST ,DELETE ,PUT ,PATCH",
    credentials: true
}));


app.use('/', indexRouter);

app.use(session({
    secret: "123456789",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true }
}));

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const clientId = '1049388978627-td6e0j1r4l772rlaisehafvlu0uu0g1m.apps.googleusercontent.com'
const clientSecret = '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'
const UserModal = require("./model/User.model");
passport.use(
    new GoogleStrategy({
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: "http://localhost:5000/auth/google/callback",
        passReqToCallback: true,
        scope: ["profile", "email"]
    }, async (request, accessToken, refreshToken, profile, done) => {
        // localStorage.setItem(accessToken)
        try {
            let user = await UserModal.findOne({ email: profile.emails[0].value });
            if (!user) {
                user = new UserModal({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    role: "user",
                    password: Number(Math.floor(Math.random() * 90000) + 10000),
                    phone: Number(Math.floor(Math.random() * 9000000000) + 1000000000),
                })
                await user.save();
            }
            return done(null, user)
        } catch (error) {
            return done(error, null)
        }
    })
);
passport.serializeUser((user, done) => {
    done(null, user)
});
passport.deserializeUser((user, done) => {
    done(null, user)
});
app.get('/auth/google', passport.authenticate('google', { scope: ["email", 'profile'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
    async (req, res) => {
        const userData = req.user
        // console.log("/auth/google/callback", req.user)
        const googleAccessToken = jwt.sign({ userData }, "googleUserData", { expiresIn: "1d" })
        res.cookie("googleAccessCookie", googleAccessToken, {
            maxAge: 20000000, httpOnly: true,
            secure: true
        });
        res.redirect(`http://localhost:3000/`);
    }
);



app.get('/getCookies', (req, res) => {
    try {
        const cookies = req.cookies.googleAccessCookie
        if (cookies) {
            const decoded = jwt.decode(cookies)
            // console.log(decoded)
            res.send({
                googleAccessToken: cookies,
                decoded: decoded.userData,
                success: true,
                message: "getting all the cookies",
            })
        } else {
            res.status(400).send({
                success: false,
                message: "No googleAccessCookie found",
            });
        }

    } catch (error) {
        console.error("Error fetching cookies:", error);
        res.status(500).send({
            success: false,
            message: "Error fetching cookies",
        });
    }
})
app.get('/logout', (req, res) => {
    res.clearCookie("googleAccessCookie")
    res.clearCookie("connect.sid")
    res.clearCookie("accessToken")
    res.send({
        message: "Signed out successfully !!"
    })
})




// // payement gateway
// app.post('/create-payment-intent', async (req, res) => {
//     const { amount, currency } = req.body;
//     try {
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: amount,
//             currency: currency,
//         });
//         res.status(200).json({ clientSecret: paymentIntent.client_secret });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Google OAuth startrs
// app.use(cookieSession({
//     name: "lenskartSession",
//     keys: ["sudhanshu"],
//     maxAgeL: 24 * 60 * 60 * 100
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(cors)
// app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
// app.get('/google/callback',
//     passport.authenticate('google', {
//         successRedirect: 'http://localhost:5000/auth/google/callback',
//         failureRedirect: '/failure'
//     })
// ); 
// app.get('/userss', (req, res) => {
//     res.status(200).send({ message: "logged in user " })
// }) 
// app.get('/failure', (req, res) => {
//     res.send({ message: 'something went wrong while login' })
// })
// google Oauth ended here !!!






app.listen(port, () => {
    console.log(`LenscartClone listening on the port at http://localhost:${port}`);
});