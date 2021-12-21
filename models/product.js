const Joi = require('joi');
const mongoose = require('mongoose');


const Product = mongoose.model('Product', new mongoose.Schema({
    prodName: {
        type: String,
        uppercase: true,
        required: true,
        unique: true,
        maxlength: 50
    },
    prodId: {
        type: Number,
        required: true,
        unique: true,
    },
    upc: {
        type: Number,
        required: true,
        unique: true,
        minlength: 12, 
        maxlength: 13    
    },
    desc: {
        type: String,
        maxlength: 255
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    cost: {
        type: Number,
        required: true,
        min: 0
    },
    retailPrice: {
        type: Number,
        required: true,
        min: 0
    },
    catagory: {
        type: String,
        uppercase: true,
        required: true,
    },
    minQuantity: {
        type: Number,
        required: true,
        min: 0
    },

    isShort: {
        type: Boolean,
        default: false
    }
}));

function validateProduct(product)
{
    const schema = Joi.object({
        prodName: Joi.string().max(50).required(),
        prodId: Joi.number().required(),
        upc: Joi.number().required(),
        desc: Joi.string().max(225),
        quantity: Joi.number().min(0).default(0),
        cost: Joi.number().min(0).required(),
        retailPrice: Joi.number().min(0),
        catagory: Joi.string().required(),
        minQuantity: Joi.number().min(0).required(),
        isShort: Joi.boolean()
    });

    return schema.validate(product);
}

exports.Product = Product; 
exports.validate = validateProduct;