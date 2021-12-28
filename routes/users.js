const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require("jsonwebtoken");
const { User, validate } = require('../models/user');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

var error;

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-pwd');
  res.send(user);
});

router.post('/register', async (req, res) => {

  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({username: req.body.username});
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['username', 'pwd']));
  const salt = await bcrypt.genSalt(10);
  user.pwd = await bcrypt.hash(user.pwd, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['username', 'pwd']));
  
});



module.exports = router;