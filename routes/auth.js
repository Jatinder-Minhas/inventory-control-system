const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

var error = '';

router.get('/')
{
  res.render('login', {error:error});
}

router.post('/', async (req, res) => {
  
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

module.exports = router;