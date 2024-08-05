const { Router } = require('express');
const CartModel = require('../model/Cart.model');

const cartRouter = Router();

// getting all the products of cart
cartRouter.get("/", async (req, res) => {
    try {
        const cartData = await CartModel.find({ userID: req.query.userID });
        res.status(200).json(cartData);
    } catch (error) {
        res.send({ "msg": error.message })
    }
});

// for adding to cart
cartRouter.post("/addtocart", async (req, res) => {
    try {
        const product = new CartModel(req.body);
        await product.save();
        res.send({ "msg": "Product added to cart!!" })
    } catch (error) {
        res.send({ "messages ": error.message })
    }
});

// for updating product
cartRouter.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const product = await CartModel.findOne({ _id: id });

    if (product) {
        // == req.body.userID
        if (product.userID) {
            await CartModel.findByIdAndUpdate({ _id: id }, req.body)
            res.send({ "msg": `Product with ${id} has been updated!!` })
        } else {
            res.send({ "msg": "You are not authorized to update it!!" })
        }
    } else {
        res.send({ message: "Product not found!!" })
    }
})

// delete product from cart
cartRouter.delete("/delete/:id", async (req, res) => {
    const { id } = req.params
    const product = await CartModel.findOne({ _id: id })
    if (product) {
        // == req.body.userID
        if (product.userID) {
            await CartModel.findByIdAndDelete({ _id: id })
            res.send({ "msg": `Product with ${id} has been deleted!!` })
        } else {
            res.send({ "msg": "You are not authorized to delete it!!" })
        }
    } else {
        res.send({ "msg": "Product not found!!" })
    }
});

// emptying cart after checkout
cartRouter.delete("/deletemany", async (req, res) => {
    try {
        await CartModel.deleteMany({ userID: req.body.userID })
        res.send("Cart emptyed successfully!!")
    } catch (error) {
        res.send({ "msg": error.message })
    }
})


//paymentGateway 
// cartRouter.post("/cart/create-checkout-session", async (req, res) => {
//     const products = req.body;
//     console.log("inside a payemnt", products)
//     // res.send(req.body)
//     // const listItem = cartData.map((products) => ({
//     //     price_data: {
//     //         currenct: "usd",
//     //         product_data: {
//     //             name: products.name
//     //         },
//     //         unit_amount: Math.round(products.price * 100)
//     //     },
//     //     quantity: products.quantity
//     // }));

//     // const session = await stripe.checkout.sessions.create({
//     //     payment_methods_type: ["card"],
//     //     line_items: line_Items,
//     //     mode: "Payment",
//     //     success_url: "",
//     //     failure_url: ""
//     // });

//     res.json({ id: session.id });
// });

module.exports = cartRouter;