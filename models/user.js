const Joi = require('joi');
const mongoose = require('mongoose');


const User = mongoose.model('User', new mongoose.Schema({
    userName: {
        type: String,
        uppercase: true,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 50
    },

    pwd: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    }
}));

function validateUser(user)
{
    const schema = Joi.object({
        userName: Joi.string().min(5).max(50).required(),
        pwd: Joi.string().min(5).max(255).required()
    });

    return schema.validate(user);
}

exports.Customer = User; 
exports.validate = validateUser;