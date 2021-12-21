const Joi = require('joi');
const mongoose = require('mongoose');


const Customer = mongoose.model('Customer', new mongoose.Schema({
    custName: {
        type: String,
        uppercase: true,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
        maxlength:20
    }
}));

function validateCustomer(customer)
{
    const schema = Joi.object({
        custName: Joi.string().min(1).max(50).required(),
        phone: Joi.Number().min(10).max(10).required()
    });

    return schema.validate(customer);
}

exports.Customer = Customer; 
exports.validate = validateCustomer;