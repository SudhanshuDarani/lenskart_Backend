const mongoose = require('mongoose');

const ordersSchema = mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
    userID: { type: String, required: true },
    userName: { type: String, required: true },
    status: { type: String, required: true, default: "Placed" },
    totalAmount: { type: Number, required: true },
    email: { type: String, required: true, trim: true }
}, {
    versionKey: false
});

const OrderModel = mongoose.model('order', ordersSchema);

module.exports = { OrderModel };