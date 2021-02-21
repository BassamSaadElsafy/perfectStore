var req = require("../config.js");

var multer  = require('multer')
var upload = multer({ dest: 'public/uploads/' })

let connection = req.connection;
var user = {
  getAdd: function (req, res) {
    res.render("admin/users/add", {user: req.session.user});
  },
  postAdd: function (req, res) {
    console.log(req.body);

    let first_name = req.body.first_name;
    let last_name  = req.body.last_name;
    let email      = req.body.email;
    let phone      = req.body.phone;
    
    let address    = req.body.address;
    let password   = req.body.password;
    let conf_password = req.body.conf_password;

    var results = {};

    //validation
    if (
      first_name == "" ||
      last_name == "" ||
      phone == "" ||
      email == "" ||
      password == "" ||
      conf_password == "" 
    ) {
      //   response.render("index", { user: user });
      results.error = "you should fill all fields!";
    } else {
      if (password != conf_password) {
        results.error = "confirm password not match password!!";
      } else {
        // connection.connect(function (err) {
        connection.getConnection(function (err, connect) {
          if (err) throw err;

          $query = "insert into users (`first_name`, `last_name`, `phone`, `address`, `admin`, `email`, `password`, `created_at`, `updated_at`) values (?,?,?,?,'0',?,?,CURRENT_DATE,CURRENT_DATE)";

          connect.query( $query, [first_name ,last_name, phone , address, email ,  password ],
            function (err, result) {
              if (err) throw err;
              console.log(err);
              console.log(result);
            }
          );

          connect.release();
        });

        results.statusText = "User Added Successfully";
        results.statusCode = "201"; //created
      }
    }

    // console.log(results);
    res.send(results);
  },
  edit: function (req, res) {

    console.log(req.params.id);

    let user_id = req.params.id;

    connection.getConnection(function (err, connect) {
      
        if (err) throw err;


        $query = "select * from users where user_id = ?";

        connect.query($query, [user_id], function (err, result) {
            if (err) throw err;
            console.log(err);
            console.log(result);

            connect.release();

            res.render("admin/users/edit", { customer: result , user: req.session.user });
        });
    });

  },

  postEdit: function (req, res) {
    console.log(req.body);

    console.log("========================");
    let user_id = req.params.id;
    console.log(user_id);
    console.log("========================");

    

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
      last_name  == "" ||
      phone      == "" ||
      email      == "" ||
      password   == "" ||
      conf_password == ""   ) {
      //   response.render("index", { user: user });
      results.error = "you should fill all fields!";
    } else {
      if (password != conf_password) {
        results.error = "confirm password not match password!!";
      } else {
        // connection.connect(function (err) {
        connection.getConnection(function (err, connect) {
          if (err) throw err;

            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            today = yyyy + '-' + mm + '-' + dd;

          
          $query = "UPDATE `users` SET `first_name`=?,`last_name`=?,`phone`=?,`address`=?,`email`=?,`password`=?,`updated_at`=? WHERE `user_id` = ?"

          connect.query($query, [first_name, last_name, phone, address,email, password, (today).toString(), Number(user_id)],
            function (err, result) {
              if (err) throw err;
              console.log(err);
              console.log(result);
            }
          );

          connect.release();
        });

        results.statusText = "User Updated Successfully";
        results.statusCode = "200"; 
      }
    }

    console.log(results);
    res.send(results);
  },

  delete: function (req, res) {

    connection.getConnection(function (err, connect) {
      
        if (err) throw err;

        $query = "delete from users where user_id = ?";

        connect.query($query,[req.body.user_id], function (err, result) {
            if (err) throw err;
            console.log(err);
            console.log(result);

            connect.release();

            // showAll(req,res);
            res.render("admin/users/index", { success: 'user deleted successfully' });
        });
    });

  },

  showAll: function (req, res) {

    connection.getConnection(function (err, connect) {
      
        if (err) throw err;

        $query = "select * from users where admin = '0'";

        connect.query($query, function (err, result) {
            if (err) throw err;
            console.log(err);
            console.log(result);

            connect.release();

            res.render("admin/users/index", { users: result , user: req.session.user });
        });
    });
  },

  router: function (app, parserBody) {
    app.get("/api/dashboard/users", this.showAll);

    app.get("/api/dashboard/users/add", this.getAdd);
    app.post("/api/dashboard/users/add", parserBody, upload.single('avatar'), this.postAdd);

    app.get("/api/dashboard/users/edit/:id", this.edit);
    app.post("/api/dashboard/users/edit/:id", parserBody,this.postEdit);

    app.delete("/api/dashboard/users", parserBody,  this.delete);
  },
};

exports.controller = user;
