const mongoose = require('mongoose');

const wishlistSchema = mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    userID: { type: String, required: true },
    userName: { type: String, required: true },
    productId: { type: String, required: true },    
})

const WishlistModel = mongoose.model('wishlist', wishlistSchema);

module.exports = WishlistModel;  