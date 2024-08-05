const mongoose = require('mongoose');
const validator = require('validator');
const WishlistModel = require('./Wishlist.model');
const userSchema = mongoose.Schema({
    // logic
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: [
            true,
            "Please Enter your Email"
        ],
        trim: true,
        unique: [
            true,
            "Please use unique mail to create an account"
        ],
        validate: {
            validator: validator.isEmail,
            message: "Invalid email address",
            // validator: function(value){
            //     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);  
            // }
        }
    },
    password: {
        type: String,
        required: true,
        // trim: true,
        // minlength: 6, 
        // maxlength: 11  
    },
    phone: {
        type: Number,
        required: true,
        trim: true,
        unique: true,
        minlength: [10, "Phone number must be 10 numeric long"],
        maxlength: [10, "Phone must not exceed 10 digits"]
    },
    address: {
        type: String,
        // required: true,
        trim: true,
    },
    role: {
        type: String,
        // required: true
    },
    accessToken: {
        type: String
    },
});
const UserModel = mongoose.model('user', userSchema);
module.exports = UserModel;