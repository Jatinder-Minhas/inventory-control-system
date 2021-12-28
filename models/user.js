const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        uppercase: true,
        required: true,
        unique: true,
        minlength: 2,
        maxlength: 50
    },

    pwd: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    }
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id}, config.get('jwtPrivateKey'))
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user)
{
    const schema = Joi.object({
        username: Joi.string().min(2).max(50).required(),
        pwd: Joi.string().min(5).max(255).required()
    });

    return schema.validate(user);
}

exports.User = User; 
exports.validate = validateUser;