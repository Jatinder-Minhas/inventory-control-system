const { User, validate } = require('../models/product');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/api/login', async (req, res) => {
    const products = await Product.find().all();
    res.render('createOrder', { products: products });
  });

  module.exports = router;