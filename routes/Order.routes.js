const { Router } = require('express');
const { OrderModel } = require('../model/Orders.model');
const senderOrderConfirmationEmail = require('../mailer')
const orderRouter = Router();
const CORS = require("cors");
const express = require("express")
const app = express();
app.use(CORS({ origin: true, methods: "GET ,POST ,DELETE ,PUT,PATCH", credentials: true }));
// getting all products in orders
orderRouter.get('/', async (req, res) => {
    try {
        const products = await OrderModel.find();
        res.send(products);
    } catch (error) {
        res.send({ "msg": error.message });
    }
})

function getTitles(dataArray) {
    return dataArray.map(item => item.title)
}
function getPrice(dataArray) {
    return dataArray.map(item => item.price)
}
function getQuantity(dataArray) {
    return dataArray.map(item => item.quantity)
}
// for adding products to orders
orderRouter.post('/', async (req, res) => {
    //const payload={...req.body,status:"Placed"}    
    try {
        const orders = req.body.map(order => ({
            ...order,
            status: "Placed"
        }));

        const titlesExtracted = getTitles(orders)
        const priceExtracted = getPrice(orders)
        const quantitesExtracted = getQuantity(orders)
        const email = orders[0].email
        const totalAmount = orders[0].totalAmount;

        await OrderModel.insertMany(orders);
        senderOrderConfirmationEmail(email, orders, titlesExtracted, priceExtracted, quantitesExtracted, totalAmount)
        res.send({ "msg": "Product added to orders list!!", data: req.body });
    } catch (error) {
        res.status(500).send({ "msg": error.message });
    }
});

// for updating status
orderRouter.patch('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await OrderModel.findByIdAndUpdate({ _id: id });
        res.send({ "msg": `Status of product with ${id} has been updated!!` })
    } catch (error) {
        res.send({ "msg": error.message });
    }
})

// for deleting 
orderRouter.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await OrderModel.findByIdAndDelete({ _id: id }, req.body);
        res.send({ "msg": `Product with ${id} has been deleted!!` })
    } catch (error) {
        res.send({ "msg": error.message });
    }
})

module.exports = orderRouter;