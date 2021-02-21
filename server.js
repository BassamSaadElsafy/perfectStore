var express = require("express");
var app     = express();               //craeting server
//set server configuration 
app.set("view engine", "ejs");         //by default read files.ejs from folder views


var bodyParser = require('body-parser');
var parserBody = bodyParser.urlencoded({extended:false});

/*---------Middleware authentication---------*/
const authorize = require("./authorization-middleware.js");
/*------------------Session------------------*/
var session = require('express-session');

app.use(bodyParser.json());                

app.use('/public',express.static(__dirname + '/public'));
app.use('/img',express.static(__dirname + '/public/img'));
app.use('/css',express.static(__dirname + '/public/css'));
app.use('/js',express.static(__dirname + '/public/js'));
app.use('/admin/',express.static(__dirname + '/public/admin/'));

app.use(session({secret: 'bassam' , resave: false , saveUninitialized: false}));

//middleware for authorization
app.use('/api/dashboard',authorize());

let userController        = require("./controllers/user");
let categoryController    = require("./controllers/category");
let siteController        = require("./controllers/site");
let productController     = require("./controllers/product");
let contactController     = require("./controllers/contact");
let adminController       = require("./controllers/admin");
let cartController        = require("./controllers/cart");
let orderController       = require("./controllers/order");
let reviewController       = require("./controllers/review");

userController.controller.router(app, parserBody);
categoryController.controller.router(app, parserBody);
siteController.controller.router(app, parserBody);
productController.controller.router(app, parserBody);
contactController.controller.router(app, parserBody);
adminController.controller.router(app, parserBody);
cartController.controller.router(app, parserBody);
orderController.controller.router(app, parserBody);
reviewController.controller.router(app, parserBody);

app.listen(8080);                //server port which listens on....

