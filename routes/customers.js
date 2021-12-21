const {Customer, validate} = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/view', async (req, res) => {

  const customers = await Customer.find();

  res.render('viewCustomers', { customers: customers})

}); 

router.post('/searchCustomer', async (req, res) => {

  txtSearch = req.body.txtSearch;

  if(isNaN(txtSearch))
  {
    customers = await Customer.find().where({custName: txtSearch});
  }
  else
  {
   customers = await Customer.find().where({phone: txtSearch});
  }

  res.render('viewCustomers', { customers: customers})

}); 

  module.exports = router;