const auth = require('../middleware/auth');
const {Customer, validate} = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/view', auth, async (req, res) => {

  const customers = await Customer.find();

  res.render('viewCustomers', { username: global.username, customers: customers})

}); 

router.post('/searchCustomer', auth, async (req, res) => {

  txtSearch = req.body.txtSearch;

  if(isNaN(txtSearch))
  {
    customers = await Customer.find().where({custName: txtSearch});
  }
  else
  {
   customers = await Customer.find().where({phone: txtSearch});
  }

  res.render('viewCustomers', { username: global.username, customers: customers})

}); 

  module.exports = router;