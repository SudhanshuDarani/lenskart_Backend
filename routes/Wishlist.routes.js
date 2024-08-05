const { Router } = require('express');
const WishlistModel = require('../model/Wishlist.model');
const wishListRouter = Router();

// getting all the products of wishlist
wishListRouter.get("/", async (req, res) => {
    try {
        const wishlistData = await WishlistModel.find({ userID: req.query.userID });
        // console.log("get list", wishlistData.length)
        res.status(200).json(wishlistData);
    } catch (error) {
        res.send({ "msg": error.message })
    }
}); 

// for adding to wishlist
wishListRouter.post("/addtowishList", async (req, res) => {
    try {
        // res.send({ message: req.body })
        // console.log(req.body)
        const product = new WishlistModel(req.body);
        await product.save();
        res.status(201).json({ "msg": "Product added to wishList!!", wishlistData: product })
    } catch (error) {
        res.send({ "messages ": error.message })
    }
});

// delete product from wishlist
wishListRouter.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params
        // console.log("delete Id", id)
        const product = await WishlistModel.findById({ _id: id })
        if (!product) {
            return res.status(404).json({ "msg": "Product not found!!" })
        }
        if (product.userID !== req.body.userID) {
            return res.status(403).json({ "msg": "You are not authorized to delete it!!" });  
        }

        await WishlistModel.findByIdAndDelete({ _id: id });
        res.json({ "msg": `Product with ${id} has been deleted!!`, wishlistData: product });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = wishListRouter;