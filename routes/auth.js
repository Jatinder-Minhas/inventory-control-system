const config = require('config')
const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require("jsonwebtoken");
const { User } = require('../models/user');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

var error = '';

router.get('/login', async (req, res) => {
  res.render('login', {error:error});
});

router.post('/login', async (req, res) => {
  
    let user = await User.findOne({username: req.body.username});
    if (!user)
    {
      error = 'Invalid username or password'
      res.redirect('/api/auth/login/');
      return
    }

    const validPwd = await bcrypt.compare(req.body.pwd, user.pwd);
    if(!validPwd)
    {
      error = 'Invalid username or password'
      res.redirect('/api/auth/login/');
      return
    }

    const token = user.generateAuthToken();
    global.username = user.username;

    error = '';

    res.cookie('jwt',token, { httpOnly: true, secure: true, maxAge: 3600000 });
    res.redirect('/api/products/inventory');
});

router.get('/logout', async (req, res) => {
  delete global[username];
  res.clearCookie("jwt");
  res.redirect('/api/auth/login/');
});

function validate(req)
{
    const schema = Joi.object({
        username: Joi.string().min(2).max(50).required(),
        pwd: Joi.string().min(5).max(255).required()
    });

    return schema.validate(req);
}

module.exports = router;