require('dotenv').config();
var cookies = require("cookie-parser");
const config = require('config');
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const mongoose = require('mongoose');
const customers = require('./routes/customers');
const products = require('./routes/products');
const orders = require('./routes/orders');
const users = require('./routes/users');
const auth = require('./routes/auth');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

if(!config.get('jwtPrivateKey'))
{
  console.error('FATEL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}


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


app.use(express.json());
app.use(express.json()); // support json encoded bodies
app.use(express.urlencoded({extended: true}))
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use('/api/customers', customers);
app.use('/api/auth', auth);
app.use('/api/products', products);
app.use('/api/Orders', orders);
app.use('/api/users', users);
app.use('/api/customers', customers);

const port = process.env.PORT || 3000;
app.listen(port, () => startupDebugger(`Listening on port ${port}...`));