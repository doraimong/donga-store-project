const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    user: {
        type: Array,
        default: []
    },
    data: {
        type: Array,
        default: []
    },
    product: {
        type: Array,
        default: []
    }
}, { timestamps: true })    //등록시간 업데이트시간 관리


const Payment = mongoose.model('Payment', paymentSchema);

module.exports = { Payment }