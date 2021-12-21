const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const customers = require('./routes/customers');
const products = require('./routes/products');
const orders = require('./routes/orders');
const users = require('./routes/users');
const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');

const username = "GSDSurinder1";
const password = "GSDSurinder9865";
const cluster = "inventory0.y24ip";
const dbname = "InventoryAndOrder";

mongoose.connect(
  `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

// mongoose.connect('mongodb+srv://GSDSurinder1:GSDSurinder9865@inventory0.y24ip.mongodb.net/InventoryAndOrder?retryWrites=true&w=majority')
//     .then(() => dbDebugger('Connected to MongoDB...'))
//     .catch(err => dbDebugger('Database connection failed!'));

app.use(express.json());
app.use(express.json()); // support json encoded bodies
app.use(express.urlencoded({extended: true}))
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use('/api/customers', customers);
app.use('/', products);
app.use('/api/products', products);
app.use('/api/Orders', orders);
app.use('/api/users', users);
app.use('/api/customers', customers);

const port = process.env.PORT || 3000;
app.listen(port, () => startupDebugger(`Listening on port ${port}...`));