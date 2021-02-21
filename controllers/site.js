var req = require("../config.js");

let connection = req.connection;

/*-----------------------------------*/
function get_category(category_id){

  var cat_result = [];
 
  connection.getConnection(function (err, connect) {
    if (err) throw err;

    $query = 'select * from category where category_id = ?';

    connect.query( $query, [category_id],
      function (err, result) {
        if (err) throw err;
        console.log(err);
        console.log(result);

        connect.release();

        console.log("-----------------------");

        console.log( result );

        console.log("-----------------------");


        cat_result.push(result);

      }
    );

  });

    console.log("===============================");
    console.log(cat_result);
    console.log("===============================");
    return cat_result;
}

var site = {
  showHome: function (req, res) {

    connection.getConnection(function (err, connect) {

      if (err) throw err;

      $query = "select * from products";

      connect.query( $query, 
        function (err, result) {
          if (err) throw err;
          console.log(err);
          console.log(result);

          connect.release();

          res.render("site/index", { products : result, page_name : "home" , 'cart' : req.session.cart , total_price : req.session.total_price, user : req.session.customer});

        }
      );

    });

  },

  showContact: function (req, res) {
    res.render("site/contact" ,{ page_name : "contact" , 'cart' : req.session.cart , total_price : req.session.total_price , user : req.session.customer});
  },

  showShop: function (req, res) {

    connection.getConnection(function (err, connect) {
      if (err) throw err;

      $query = "select * from products";

      connect.query( $query, 
        function (err, result) {
          if (err) throw err;
          console.log(err);
          console.log(result);

          connect.release();

          res.render("site/shop", { products : result, page_name : "shop" , 'cart' : req.session.cart , total_price : req.session.total_price, user : req.session.customer});

        }
      );

    });

  },

  showCheckout: function (req, res) {

    console.log('==================================');
    let cart  = req.session.cart;
    let total = req.session.total_price;
    console.log('=================================');

    res.render("site/checkout", {page_name : "checkout" , 'cart' : req.session.cart , total_price : req.session.total_price , user : req.session.customer });

  },

  showProduct: function (req, res) {

    console.log(req.params.id);

    connection.getConnection(function (err, connect) {
      if (err) throw err;

      // $query = "select * from products where product_id = ? ";
      $query = "select * from products where product_id = ? ; select * from reviews where product_id = ? ; select * from users where admin = '0'";

      connect.query( $query, [req.params.id, req.params.id],
        function (err, result) {
          if (err) throw err;
          console.log(err);
          console.log(result[0][0]);
          console.log(result[1]);
          console.log(result[2]);

          connect.release();

          console.log("category id = "+result[0].category_id);
          

          res.render("site/product_details", { product : result[0][0],reviews: result[1] , users : result[2] , page_name : "", 'cart' : req.session.cart , total_price : req.session.total_price, user : req.session.customer});


        }
      );

    });

  },


  showLogin: function (req, res) {
    res.render("auth/login", { page_name : "" , 'cart' : req.session.cart , total_price : req.session.total_price, user : req.session.customer});
  },
  showRegister: function (req, res) {
    res.render("auth/register", {page_name : "" , 'cart' : req.session.cart , total_price : req.session.total_price, user : req.session.customer});
  },
  showCart: function (req, res) {
    
    res.render("site/cart", {page_name : "cart" , 'cart' : req.session.cart , total_price : req.session.total_price , user : req.session.customer});
  },

  showProfile: function (req, res) {
    res.render("profile.ejs", { success: "car added" ,page_name : "" , 'cart' : req.session.cart , total_price : req.session.total_price , user : req.session.customer});
  },


  postContact: function (req, res) {
    console.log(req.body);

    let name = req.body.name;
    let email = req.body.email;
    let phone = req.body.phone;
    let subject = req.body.subject;
    let msg = req.body.msg;


    var results = {};

    //validation
    if (
      name == "" ||
      email == "" ||
      phone == "" ||
      subject == "" ||
      msg == ""
    ) {

      // res.render("site/contact" ,{error :  "you should fill all fields!", page_name : "contact"});

      results.error = "you should fill all fields!";

    } else {


      connection.getConnection(function (err, connect) {
        if (err) throw err;
  
        $query = "insert into `contacts`( `name`, `phone`, `email`, `subject`, `message`) values (? , ? , ? , ? , ? )";

  
        connect.query( $query, [name, phone , email , subject , msg],
          function (err, result) {
            if (err) throw err;
            console.log(err);
            console.log(result);
  
            connect.release();
  
            
            // res.render("site/contact", { products : result, success : "Message Sent Successfully", page_name : "contact"});
  
          }
        );
  
      });

      results.statusText = "Message Sent Successfully";
            results.statusCode = 201;
     
    }

    console.log(results);
    res.send(results);
  },
  postRegister: function (req, res) {
    // console.log(req.body.first_name);
    console.log("==============================");
    console.log(req.body);

    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let phone = req.body.phone;
 
    let address = req.body.address;
    let password = req.body.password;
    let conf_password = req.body.conf_password;

    var results = {};

    //validation
    if (
      first_name == "" ||
      last_name == "" ||
      phone == "" ||
      address == "" ||
      email == "" ||
      password == "" ||
      conf_password == ""  
      ) {
      //   response.render("index", { user: user });
      // results.error = "you should fill all fields!";
      res.render("auth/register",{error : "you should fill all fields!", page_name : ''});
    } else {
      if (password != conf_password) {
        // results.error = "confirm password not match password!!";
        res.render("auth/register",{error :"confirm password not match password!!", page_name: ''});

      } else {
        // connection.connect(function (err) {
        connection.getConnection(function (err, connect) {
          if (err) throw err;

          connect.query(
            "insert into users ( `first_name`, `last_name`, `phone`, `address`, `admin`, `email`, `password`, `created_at`, `updated_at`) values (? ,? ,?, ? ,'0', ? , ? , CURRENT_DATE , CURRENT_DATE)",
            [first_name , last_name, phone, address , email, password]
            ,
            function (err, result) {
              if (err) throw err;
              console.log(err);
              console.log(result);
            }
          );

          connect.release();
        });

        // results.statusText = "User Added Successfully";
        // results.statusCode = "201"; //created

        res.render('auth/login', {success : "Account Created Successfully" , page_name : ''});
      }
    }

    // console.log(results);
    // res.send(results);
  },

  //post edit profile

  postEditProfile: function (req, res) {

    console.log(req.body);

    let user_id       = req.body.user_id;
    let first_name    = req.body.first_name;
    let last_name     = req.body.last_name;
    let phone         = req.body.phone;
    let address       = req.body.address;
    let email         = req.body.email;
    let password      = req.body.password;
    let conf_password = req.body.conf_password;
  
    var results = {};

    //validation
    if ( first_name == '' || last_name == '' || phone == '' || address == '' || email == '' || password == '' || conf_password == '' ) {

      results.error = "all fieldes are required!";

    } else {

      if( password !== conf_password){
        results.error = "confirm password does not match password";
      }
      else{

        connection.getConnection(function (err, connect) {
          if (err) throw err;

            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            today = yyyy + '-' + mm + '-' + dd;

          
          $query = "UPDATE `users` SET `first_name`=?,`last_name`=?,`phone`= ?,`address`= ?,`email`= ? , `password` = ? ,`updated_at`=? WHERE user_id = ?";

          connect.query($query, [first_name, last_name, phone, address,  email, password , today, Number(user_id)],

            function (err, result) {
              if (err) throw err;
              console.log(err);
              console.log(result);
            }
          );

          connect.release();
        });

        results.statusText = "Your Profile is Updated Successfully";
        results.statusCode = "200"; 

      }
        

        
      
    }

    console.log(results);
    res.send(results);
  },

  postLogin: function (req, res) {

    console.log(req.body);

    let email = req.body.email;
    let password = req.body.password;

    let results = {};

    //validation
    if (email == "" || password == "") {
      res.render("auth/login", { error: "you should fill all fields!" , page_name : ""});
    } else {
      connection.getConnection(function (err, connect) {
        if (err) throw err;
        let query =
          "SELECT * FROM users where email = ? AND password = ? AND admin = '0' LIMIT 1";
        connect.query(query, [email, password], function (err, result) {
          if (err) throw err;
          console.log("Errot: " + err);

          let user = result[0];

          if (result[0] != null) {

            req.session.customer = user;

            console.log("logged in");
            res.render("profile", { user: req.session.customer , page_name : '' });
          } else {
            res.render("auth/login", { error: "Invalid Email Or Password" , page_name : '' });
          }
        });

        connect.release();
      });
    }
  },

  logOut: function(req, res){

    req.session.destroy();

    res.redirect('/login');

  },

  router: function (app, parserBody) {
    app.get("/", this.showHome);

    app.get("/contact", this.showContact);
    app.post("/contact", parserBody, this.postContact);

    app.get("/shop", this.showShop);
    // app.get("/product/details", this.showProduct);
    app.get("/product/:id", this.showProduct);
    app.get("/checkout", this.showCheckout);
    app.get("/cart", this.showCart);

    app.get("/login", this.showLogin);
    app.post("/login", parserBody, this.postLogin);
    
    app.get("/register", this.showRegister);
    app.post("/register", parserBody, this.postRegister);

    app.get("/profile", this.showProfile);
    app.post("/profile" , parserBody, this.postEditProfile);

    app.get("/logout", this.logOut);

  },
};

exports.controller = site;
