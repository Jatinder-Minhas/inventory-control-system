const Joi = require('joi');
const mongoose = require('mongoose');


const Order = mongoose.model('Order', new mongoose.Schema({
    
    phone: {
        type: Number,
        required: true,
        maxlength: 20
    },
    items: {
        type: Object,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        require: true
    },
    amountPaid: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean
    }
    
}));

function validateOrder(Order)
{
    const schema = Joi.object({
        phone: Joi.Number().required(),
        items: Joi.object().required(),
        date: Joi.Date().require(),
        totalPrice: Joi.Number().required(),
        amountPaid: Joi.Number().required(),
        status: Joi.boolean().required()
    });

    return schema.validate(Order);
}

exports.Order = Order; 
exports.validate = validateOrder;