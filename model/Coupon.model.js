const mongoose = require('mongoose');

const couponSchema = mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 1 },
    usedCount: { type: Number, default: 0 }
})

const CouponModel = mongoose.model('coupons', couponSchema);
module.exports = CouponModel;