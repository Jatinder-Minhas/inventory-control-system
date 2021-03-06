const auth = require('../middleware/auth');
const { Product, validate } = require('../models/product');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Catagory } = require('../models/catagory');


var error = ""; // stores the error string
var message = ""; // stores the message string
var searchMessage = ""; // stores search message

/*
  This route is used for viewing the Add Product page
*/
router.get('/add', auth, async (req, res) => {

  const catagories = await Catagory.find();

  res.render('addProduct', { username: global.username, message: message, catagories:catagories, error: error});

  error = "";
  message = "";

});

/*
  This route is used for adding a new product to the database
*/
router.post('/add/', auth, async (req, res) => {
  const product = await Product.find().where({ $or: [{ prodId: req.body.prodId }, { upc: req.body.upc }, { prodName: req.body.prodName }]});

  let cata = '';

  if(req.body.catagory == 'other')
  {
    cata = (req.body.otherCatagory).toUpperCase();

    const cataExist = await Catagory.find().where({ cataName: cata });

    if(cataExist == null || cataExist.length == 0)
    {
      let catagory = new Catagory({
        cataName: req.body.otherCatagory
      });

      catagory.save();
    }
    else
    {
      error = "Catagory already exists!"
      message="";
    }
  }
  else
  {
    cata = req.body.catagory;
  }

  console.log(product.length);

  if(product != null && product.length != 0)
  {
    error = "Product with same partId or upc or name exists"
    message="";
    res.redirect('/api/products/add');
  }
  else
  {
      let product = new Product({
      prodId: req.body.prodId,
      upc: req.body.upc,
      prodName: req.body.prodName,
      desc: req.body.desc,
      quantity: req.body.quantity,
      cost: req.body.cost,
      retailPrice: req.body.retailPrice,
      catagory: cata,
      minQuantity: req.body.minQuantity,
      isShort: (req.body.quantity - req.body.minQuantity < 0) ? true : false
    });

    product.save(function(err, doc)
      {
        if(err)
        {
          message = ""
          error="Product not added";
          res.redirect('/api/products/add');
        }
        else
        {
          message = "Product added succesfully"
          error="";
          res.redirect('/api/products/add');
        }
      });
  }
});

/*
  This route is used for viewing the Inventory page
*/
router.get('/inventory/', auth, async (req, res) => {
  const catagories = await Catagory.find();

  var products = [];
  var stringifyFile = [];

  res.render('inventory', { username: global.username, username: global.username, products: products, stringifyFile: stringifyFile, catagories:catagories });
});


/*
  This route is used searching in inventory page
*/
router.post('/searchResult/', auth, async (req, res) => {
  const catagories = await Catagory.find();

  var products = [];

  var txtSearch = req.body.txtSearch;
  var cataSearch = req.body.catagory;

  if(txtSearch != '' && txtSearch != null)
  {
    if(cataSearch != 'any')
    {
      if(!isNaN(txtSearch))
      {
        products = await Product.find().where({
                                                $or: [{ prodId: txtSearch}, { upc: txtSearch }],
                                                catagory: cataSearch.toUpperCase()
                                              });
      }
      else
      {
        products = await Product.find().where({
                                                prodName: {$regex: txtSearch.toUpperCase()} ,
                                                catagory: cataSearch.toUpperCase()
                                              });
      }
    }
    else(cataSearch == 'any')
    {
      if(!isNaN(txtSearch))
      {
        products = await Product.find({ 
                                        $or: [{ prodId: txtSearch}, { upc: txtSearch }]
                                      });
      }
      else
      {
        products = await Product.find({
                                        prodName: {$regex: txtSearch.toUpperCase()}
                                      });
      }
    }
  }
  else
  {
    if(cataSearch != 'any')
    {
      products = await Product.find({ catagory: cataSearch} );
    }
  }

  stringifyFile = JSON.stringify(products);

  res.render('inventory', { username: global.username, products: products, stringifyFile: stringifyFile, catagories:catagories });
});

/*
  This route is used for viewing the update delete page
*/
router.get('/update_delete', auth, async (req, res) => {

  res.render('update_delete', { username: global.username, product: emptyProduct(), error: "", message: "", searchMessage: "", stringifyFile: [] });

});

/*
  This route is used to search the product to be deleted
*/
router.post('/update_delete/productId/', auth, async (req, res) => {

  var product;

  if(!isNaN(req.body.prodId))
  {
    product = await Product.find().where({ $or: [{ prodId: req.body.prodId}, { upc: req.body.prodId }] });
  }
  else
  {
    product = [];
  }

  if (product.length == 0) {
    message = "";
    error = "";
    searchMessage = "Invalid partNo or UPC";
    return res.render('update_delete', { product: emptyProduct(), error: error, message: message, searchMessage:searchMessage });
  }

  stringifyFile = JSON.stringify(product);

  res.render('update_delete', { username: global.username, product: product[0], error: "", message: "", searchMessage: "", stringifyFile: stringifyFile});
});

/*
  This route is used to update the product
*/
router.post('/update_delete/product/makeUpdate', auth, async (req, res) => {

  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  cata = (req.body.catagory).toUpperCase();

  const cataExist = await Catagory.find().where({ cataName: cata });

  if(cataExist == null || cataExist.length == 0)
  {
    let catagory = new Catagory({
      cataName: cata
    });

    catagory.save();
  }

  const product = await Product.findOneAndUpdate({ $or: [{ prodId: req.body.prodId }, { upc: req.body.upc }] },
  {
      prodName: req.body.prodName,
      catagory: req.body.catagory,
      desc: req.body.desc,
      quantity: parseInt(req.body.quantity),
      minQuantity: parseInt(req.body.minQuantity),
      retailPrice: parseInt(req.body.retailPrice),
      cost: parseInt(req.body.cost),
      isShort: (req.body.quantity - req.body.minQuantity < 0) ? true : false
  }, { new: true });

  if (!product) return res.status(404).send('The Product with the given ID was not found.');

  message = "Changes are Saved";
  res.render('update_delete', { username: global.username, product: product, error: " ", message: message, searchMessage: "", stringifyFile: [] });
});

/*
  This route is used to delete an product
*/
router.post('/update_delete/product/delete', auth, async (req, res) => {

  const product = await Product.deleteOne({prodId: req.body.prodId});

    if(product.deletedCount > 0)
    {
      error = "";
      message = "Product is Deleted";
    }
    else
    {
      error = "Product with given partId not exist";
      message = "";
    }

  res.render('update_delete', { username: global.username, product: emptyProduct(), error: error, message: message, searchMessage: "", stringifyFile: [] });
});

/*
  This route is used for viewing stocks in short
*/
router.get('/stock_In_Short', auth, async (req, res) => {

  const stockInShort = await Product.find().where({isShort: true});

  res.render('stock_in_short', { username: global.username, stockInShort: stockInShort});

});

/*
  This creates an empty product
*/
function emptyProduct()
{
  p = new Product({
    prodId: '',
    upc: '',
    prodName: '',
    catagory: '',
    desc: '',
    quantity: '',
    minQuantity: '',
    retailPrice: '',
    cost: ''
  });

  return p
}

module.exports = router;