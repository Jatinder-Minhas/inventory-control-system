const { Product, validate } = require('../models/product');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
var helmet = require('helmet');
const { Catagory } = require('../models/catagory');
const { json } = require('body-parser');


var error = "";
var message = ""; 
var searchMessage = "";

/*
  This route is used for viewing the Add Product page
*/
router.get('/add', async (req, res) => {

  const catagories = await Catagory.find();

  res.render('addProduct', {message: message, catagories:catagories, error: error});

  error = "";
  message = "";

});

/*
  This route is used for adding a new product to the database
*/
router.post('/add/', async (req, res) => {
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
router.get('/', async (req, res) => {
  res.redirect('/api/products/inventory');
});

/*
  This route is used for viewing the Inventory page
*/
router.get('/inventory/', async (req, res) => {
  const catagories = await Catagory.find();

  var products = [];
  var stringifyFile = [];

  res.render('inventory', { products: products, stringifyFile: stringifyFile, catagories:catagories });
});


/*
  This route is used searching in inventory page
*/
router.post('/searchResult/', async (req, res) => {
  const catagories = await Catagory.find();

  var products = [];

  var txtSearch = req.body.txtSearch;
  var cataSearch = req.body.catagory;

  if(req.body.catagory == "any")
  {
    if(!isNaN(txtSearch))
    {
      products = await Product.find().where({ $or: [{ prodId: txtSearch}, { upc: txtSearch }] });
    }
    else
    {
      products = await Product.find().where({ prodName: {$regex: txtSearch.toUpperCase()} });
    }
  }
  else
  {
    if(!isNaN(txtSearch) || cataSearch == "")
    {
      console.log(1);
      products = await Product.find().where({ $or: [
        { prodId: txtSearch },
        { upc: txtSearch },
        { catagory: req.body.catagory}
      ]});
    }
    else
    {
      console.log(2);
      products = await Product.find().where({ $or: [
        { prodName: {$regex: txtSearch.toUpperCase()}},
        {cataName: {$regex: cataSearch.toUpperCase()} },
        { catagory: req.body.catagory}
      ]});
    }
  }

  stringifyFile = JSON.stringify(products);

  res.render('inventory', { products: products, stringifyFile: stringifyFile, catagories:catagories });
});

/*
  This route is used for viewing the update delete page
*/
router.get('/update_delete', async (req, res) => {

  res.render('update_delete', { product: emptyProduct(), error: "", message: "", searchMessage: "", stringifyFile: [] });

});

/*
  This route is used to search the product to be deleted
*/
router.post('/update_delete/productId/', async (req, res) => {

  const product = await Product.find().where({ $or: [{ prodId: req.body.prodId}, { upc: req.body.prodId }] });

  if (product.length == 0) {
    message = "";
    error = "";
    searchMessage = "Invalid product number or UPC";
    return res.render('update_delete', { product: emptyProduct(), error: error, message: message, searchMessage:searchMessage });
  }

  stringifyFile = JSON.stringify(product);

  res.render('update_delete', { product: product[0], error: "", message: "", searchMessage: "", stringifyFile: stringifyFile});
});

/*
  This route is used to update the product
*/
router.post('/update_delete/product/makeUpdate', async (req, res) => {

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  console.log(error);

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

  console.log(product);

  if (!product) return res.status(404).send('The Product with the given ID was not found.');

  message = "Changes are Saved";
  res.render('update_delete', { product: product, error: " ", message: message, searchMessage: "", stringifyFile: [] });
});

/*
  This route is used to delete an product
*/
router.post('/update_delete/product/delete', async (req, res) => {

  const product = await Product.deleteOne({prodId: req.body.prodId});

    if(product.deletedCount> 0)
    {
      error = "";
      message = "Product is Deleted";
    }
    else
    {
      error = "Product with given partId not exist";
      message = "";
    }

  res.render('update_delete', { product: emptyProduct(), error: error, message: message, searchMessage: "", stringifyFile: [] });
});

/*
  This route is used for viewing stocks in short
*/
router.get('/stock_In_Short', async (req, res) => {

  const stockInShort = await Product.find().where({isShort: true});

  res.render('stock_In_Short', { stockInShort: stockInShort});

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