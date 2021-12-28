const auth = require('../middleware/auth');
const { Product, validate } = require('../models/product');
const express = require('express');
const router = express.Router();
var helmet = require('helmet');
const { json } = require('body-parser');
const { Customer } = require('../models/customer');
const { Order } = require('../models/order');
const { render } = require('ejs');
const moment = require('moment');

var itemNo;
var custName;
var phone;
var orderTable  = [];
var totalPrice = 0;
var amountPaid = 0;

/*

<---------------- Routes related to creating orders ---------------->

*/

/*
This route is used to view the Create Order page
*/

router.get('/createOrder', auth, async (req, res) => {

  itemNo = 1;
  orderTable = [];
  var error = "";

  stringifyFile = [];

  res.render('createOrder', { username: global.username, stringifyFile: stringifyFile, products: orderTable, error: error});

});

/*
This route is used to view the Create Order page
*/

router.post('/createOrder/', auth, async (req, res) => {

  let txtSearch;
  let txtQuantity;
  let error;

  if(req.body.txtSearch != "" && !isNaN(req.body.txtSearch))
  {
    txtSearch = parseInt(req.body.txtSearch);
  }

  if(!isNaN(req.body.txtQuantity) && req.body.txtQuantity != "")
  {
    txtQuantity = parseInt(req.body.txtQuantity);
  }
  else
  {
    txtQuantity = 1;
  }

  const product = await Product.find().where({ $or: [{ prodId: txtSearch}, { upc: txtSearch }] });

  if(product != null && product.length != 0)
  {
      orderTable.push({itemNo: itemNo++, prodId: product[0].prodId, prodName: product[0].prodName, quantity: txtQuantity, retailPrice: product[0].retailPrice});
  }
  else
  {
    error = "Not found";
  }
  

  stringifyFile = JSON.stringify(orderTable);
  console.log(stringifyFile);

  res.render('createOrder', { username: global.username, stringifyFile: stringifyFile, products: orderTable, error: error});

});


router.post('/createOrder/removeItem', auth, async (req, res) => {

  var no = req.body.txtItemNo;

  for(let i = 0; i < orderTable.length; i++)
  {
    if(orderTable[i].itemNo == parseInt(no))
    {
      console.log(no);
      orderTable.splice(i,1);
    }
  }

  console.log(orderTable);

  stringifyFile = JSON.stringify(orderTable);

  res.render('createOrder', { username: global.username, stringifyFile: stringifyFile, products: orderTable, error: ""});

});


/*
This route is used to add the order
*/

router.post('/addToOrder', auth, async (req, res) => {

    custName = req.body.custName;
    phone = req.body.phone;
    amountPaid = req.body.amountPaid;
    totalPrice = totalCostSum(orderTable);

    const customer = await Customer.find().where({phone: phone});

    if(customer == null || customer == undefined || customer.length < 1)
    {
       let customer = new Customer({
        custName: custName,
        phone: phone
      });

      customer.save(function(err, doc)
      {
        if(err)
        { 
          console.error(err); 
        }
      });
   }

  let order = new Order({
    phone: phone,
    items: orderTable,
    date: Date.now(),
    totalPrice: totalPrice,
    amountPaid: amountPaid,
    status: ((totalPrice - amountPaid) == 0) ? true : false
  });

  order.save(function(err, doc)
  {
    if(err)
    {
      console.error(err);
    }
    else
    {
      console.log("created")
      ajductQuantity(orderTable);
    }
  });

  var error = "";
  stringifyFile = [];

  res.render('createOrder', { username: global.username, stringifyFile: stringifyFile, products: orderTable, error: error});
  });

/*
This route is used to view the View Order page
*/

router.get('/view', auth, async (req, res) => {

    const orders = await Order.find().where({ date: {
      $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 
      $lt: new Date(Date.now())
    }})

    stringifyFile = JSON.stringify(orders);

    res.render('viewOrders', { username: global.username,stringifyFile: stringifyFile, orders: orders, moment: moment});

  });

/*
This route is used to search the order on View Order page
*/

  router.post('/searchOrder', auth, async (req, res) => {

    var orders = [];
  
    var txtSearch = req.body.txtSearch;
    
    console.log(req.body.beginDate)
    console.log(req.body.endDate);
    
    if(req.body.beginDate == "" && req.body.endDate == "")
    {
      var beginDate =  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      var endDate = Date.now();
    }
    else if(req.body.beginDate != "" && req.body.endDate == "")
    {
      var beginDate = new Date(req.body.beginDate).toISOString();
      var endDate = Date.now();
    }
    else if(req.body.beginDate == "" && req.body.endDate != "")
    {
      var endDate = new Date(req.body.endDate).toISOString();
      var beginDate = new Date(endDate - 1 * 24 * 60 * 60 * 1000);;
    }
    else
    {
      var beginDate = new Date(req.body.beginDate).toISOString();
      var endDate = new Date(req.body.endDate).toISOString();
    }

    if(!isNaN(txtSearch) && txtSearch != "")
    {
      orders = await Order.find().where(
        { $and: [{ phone: txtSearch}, 
                 { date: {
                          $gte: beginDate, 
                          $lt: endDate
                         }
                 }] }
      );
    }
    else if(txtSearch == "")
    {
      orders = await Order.find().where(
        {
            date: {
                    $gte: beginDate, 
                    $lt: endDate
                  }
        }
      );
    }
    else
    {
      const customer = await Customer.find().where({ custName: txtSearch});
      orders = await Order.find().where(
        { $and: [{ custName: txtSearch}, 
                 { date: {
                          $gte: beginDate, 
                          $lt: endDate
                         }
                 }] 
        }
      );
    }
  
    stringifyFile = JSON.stringify(orders);
  
    res.render('viewOrders', { username: global.username, orders: orders, stringifyFile: stringifyFile, moment: moment });
  });

/*
This route is used to view the details of the order
*/

  router.post('/viewOrder', auth, async (req, res) => {

    console.log((req.body._id).trim());

    _id = (req.body._id).trim();

    const orders = await Order.find().where({ _id: _id})

    console.log(JSON.stringify(orders));

    res.render('orderDetails', { username: global.username, orders: orders, moment: moment});

  });

/*
This route is used to change the status of a order to paid
*/

  router.post('/changeStatus', auth, async (req, res) => {

    _id = (req.body._id).trim();

    const or = await Order.find().where({ _id: _id})

    totalPrice = or[0].totalPrice;

    const order = await Order.findOneAndUpdate({ _id: _id},
      {
        amountPaid: totalPrice,
        status: true
      }, { new: true });

     const orders = await Order.find().where({ date: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 
        $lt: new Date(Date.now())
      }});
  
      stringifyFile = JSON.stringify(orders);
  
      res.render('viewOrders', { username: global.username, stringifyFile: stringifyFile, orders: orders, moment: moment});

  });

/*
This function is used to calculate the total price of the order
*/
  function totalCostSum(orderTable) {
    var totalCostSum = 0;

    for (let i = 0; i < orderTable.length; i++) {
      totalCostSum = parseFloat(orderTable[i].retailPrice) * parseFloat(orderTable[i].quantity);
    }

    return totalCostSum;
  };

  async function ajductQuantity(orderTable)
  {
    console.log(orderTable.length);
    for (let i = 0; i < orderTable.length; i++) {

      var prodId = orderTable[i].prodId;

      const product = await Product.find().where({prodId: prodId});

      q = product[0].quantity;
      console.log("q: " + q);

      isShort = (q - parseInt(orderTable[i].quantity) < product[0].minQuantity) ? true : false;
      console.log(isShort);

      const p = await Product.findOneAndUpdate({ prodId: prodId},
      {
          quantity: q - parseInt(orderTable[i].quantity),
          isShort: isShort
      }, { new: true });
    
    }
  };

  module.exports = router;