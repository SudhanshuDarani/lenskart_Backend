const express = require('express');
const { userRouter } = require('./User.routes');
const eyeglassRoutes = require('./Eyeglasses.routes');
const cartRouter = require('./Cart.routes');
const { authrouter } = require('./authRouter');
const { Adminouter } = require('./AdminRouter');
const { couponRotes } = require('./CouponsRouter')
const orderRouter = require('./Order.routes');
const morgan = require("morgan");
const indexRouter = express.Router();
const wishListRouter = require('./Wishlist.routes');
// const { MustBeSigned } = require('../middleware/authenticate');
// const cors = require("cors");

// indexRouter.use(cors())
indexRouter.get('/', (req, res) => {
    // res.cookie('accessToken', "dddddddd", { sameSite: 'none', httpOnly: true });
    return res.send(true);
})
indexRouter.use("/coupons", couponRotes);
indexRouter.use("/api/v1/auth", authrouter);
indexRouter.use('/user', userRouter);
indexRouter.use('/eyeglasses', eyeglassRoutes);
indexRouter.use(morgan("dev"));


indexRouter.use("/admin", Adminouter);
indexRouter.use("/orders", orderRouter);

//authentication middleware will come here
indexRouter.use('/cart', cartRouter);
indexRouter.use('/wishlist', wishListRouter);

module.exports = { indexRouter } 