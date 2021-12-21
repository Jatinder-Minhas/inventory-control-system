const Joi = require('joi');
const mongoose = require('mongoose');


const Catagory = mongoose.model('Catagory', new mongoose.Schema({
    cataName: {
        type: String,
        uppercase: true,
        required: true,
        minlength: 5
    }
}));

function validateCatagory(catagory)
{
    const schema = Joi.object({
        cataName: Joi.string().min(5).required()
    });

    return schema.validate(catagory);
}

exports.Catagory = Catagory; 
exports.validate = validateCatagory;