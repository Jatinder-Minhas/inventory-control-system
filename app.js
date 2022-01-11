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

/*
  Database details
*/
const username = "GSDSurinder1";
const password = "GSDSurinder9865";
const cluster = "inventory0.y24ip";
const dbname = "InventoryAndOrder";

/*
  Connecting to mongodb database
*/
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
app.use('/', auth);
app.use('/api/products', products);
app.use('/api/Orders', orders);
app.use('/api/customers', customers);

const port = process.env.PORT || 3000;
var server = app.listen(port, function() {
  var port = server.address().port;
  var url = `http://localhost:${port}`;

  var start =
    process.platform == "darwin"
      ? "open"
      : process.platform == "win32"
      ? "start"
      : "xdg-open";
  require("child_process").exec(start + " " + url);
  console.log("App now running on port", port);
  console.log("If not redirected go to 'http://localhost:3000/'");
});