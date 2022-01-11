const auth = require('../middleware/auth');
const {Customer, validate} = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


/*
  This routes is used to view all the customers
*/
router.get('/view', auth, async (req, res) => {

  res.render('viewCustomers', { username: global.username, customers: [], error: ""});

}); 

/*
  This routes is used to search the customers using name and phone number
*/
router.post('/searchCustomer', auth, async (req, res) => {

  var error = "";
  txtSearch = req.body.txtSearch;

  if(txtSearch == "")
  {
    customers = await Customer.find();
  }
  else if(isNaN(txtSearch))
  {
    customers = await Customer.find().where({custName: txtSearch});
  }
  else
  {
    customers = await Customer.find().where({phone: txtSearch});
  }

  if(customers.length <= 0)
  {
    error = "Not found";
  }

  res.render('viewCustomers', { username: global.username, customers: customers, error: error});

}); 

module.exports = router;