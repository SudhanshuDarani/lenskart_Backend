const { Router } = require('express');
const CouponModel = require('../model/Coupon.model');

const couponRotes = Router();
couponRotes.get('/', async (req, res) => {
  try {
    const coupons = await CouponModel.find()
    res.send(coupons)
  } catch (err) {
    res.send({ message: "error to get the coupon !!" }) 
  }
})

couponRotes.post('/create', async (req, res) => {
  const { code, discount, expirationDate, usageLimit } = req.body;
  const newCoupon = new CouponModel({ code, discount, expirationDate, usageLimit });
  try {
    await newCoupon.save();
    res.status(201).json(newCoupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

couponRotes.post('/apply', async (req, res) => {
  const { code } = req.body
  try {
    const coupon = await CouponModel.findOne({ code })
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found or inactive" })
    }
    if (coupon.expirationDate < new Date()) {
      return res.status(400).json({ message: "Coupon has expired !!" })
    }
    res.status(200).json({ message: 'Coupon is valid', coupon });
  } catch (error) {
    res.status(400).json({ message: "Error validating coupon !!", error }) 
  }
})


module.exports = { couponRotes };