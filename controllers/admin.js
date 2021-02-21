var req = require("../config.js");

let connection = req.connection;

var admin = {
  login: function (req, res) {
    
    res.render("admin/login");

  },
  getEditProfile: function (req, res) {
    res.render("admin/edit_profile",  {user: req.session.user});

  },

  postEditProfile: function (req, res) {

    console.log(req.body);

    let admin_id       = req.body.admin_id;
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

          connect.query($query, [first_name, last_name, phone, address,  email, password , today, Number(admin_id)],

            function (err, result) {
              if (err) throw err;
              console.log(err);
              console.log(result);
            }
          );

          connect.release();
        });

        req.session.user = req.body;

        console.log(req.session.user);

        results.statusText = "Your Profile is Updated Successfully";
        results.statusCode = "200"; 

      }
        
    }

    console.log(results);
    res.send(results);
  },
  getDashboard: function (req, res) {


    connection.getConnection(function (err, connect) {
      if (err) throw err;
      
      $query = "select * from orders ; select * from users where admin = '0' ; select * from products ; select * from category";

      connect.query($query, 

        function (err, result) {
          if (err) throw err;
          console.log(err);
          console.log("------------=======----------");
          console.log("------------=======----------");
          console.log("------------=======----------");
          console.log("------------=======----------");
          console.log("------------=======----------");
          console.log(result[0]);
          console.log(result[1]);
          console.log(result[2]);
          console.log(result[3]);


          res.render("admin/dashboard", {user: req.session.user , orders : result[0] , users : result[1] , products : result[2] , categories : result[3]});
          connect.release();


        }
      );

    });
  },
  postLogin: function (req, res) {

    console.log(req.body);

    let email = req.body.email;
    let password = req.body.password;

    let results = {};

    //validation
    if (email == "" || password == "") {
      res.render("admin/login", { error: "you should fill all fields!" });
    } else {
      connection.getConnection(function (err, connect) {
        if (err) throw err;
        let query =
          "SELECT * FROM users where email = ? AND password = ? AND admin = '1' LIMIT 1";
        connect.query(query, [email, password], function (err, result) {
          if (err) throw err;
          console.log(err);

          console.log(result[0]);

          let user = result[0];

          if (result[0] != null) {

            console.log("logged in");

            req.session.success = true;       //authorization

            req.session.user = user;          //
         
            res.render("admin/dashboard", { user: user });
          } else {
            res.render("admin/login", { error: "Invalid Email Or Password" });
          }
        });

        connect.release();
      });
    }
  },

  logOut: function(req, res){

    req.session.destroy();

    res.redirect('/api/login');

  },

  router: function (app, parserBody) {

    app.get("/api/dashboard", this.getDashboard);

    app.get("/api/login", this.login);
    app.post("/api/login",  parserBody, this.postLogin);


    app.get("/api/logout", this.logOut);

    app.get("/api/profile", this.getEditProfile);
    app.post("/api/profile",  parserBody, this.postEditProfile);

  }
};

exports.controller = admin;
