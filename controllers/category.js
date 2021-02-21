var req = require("../config.js");

let connection = req.connection;

var category = {
  getAdd: function (req, res) {
    res.render("admin/categories/add", {user: req.session.user});
  },
  postAdd: function (req, res) {
    console.log(req.body);

    let category_name = req.body.category_name;
  
    var results = {};

    //validation
    if ( category_name == '') {

      results.error = "Category Name Field Is Required!";

    } else {
    
        // connection.connect(function (err) {
        connection.getConnection(function (err, connect) {
          if (err) throw err;

          connect.query(
            "insert into category (`category_name`) values (?)", [category_name],
            function (err, result) {
              if (err) throw err;
              console.log(err);
              console.log(result);
            }
          );

          connect.release();
        });

        results.statusText = "Category Created Successfully";
        results.statusCode = "201"; //created
      
    }

    console.log(results);
    res.send(results);
  },
  edit: function (req, res) {

    console.log(req.params.id);

    let category_id = req.params.id;

    connection.getConnection(function (err, connect) {
      
        if (err) throw err;


        $query = "select * from category where category_id = ?";

        connect.query($query, [category_id], function (err, result) {
            if (err) throw err;
            console.log(err);
            console.log(result);

            connect.release();

            res.render("admin/categories/edit", { category: result,user: req.session.user });
        });
    });

  },

  postEdit: function (req, res) {
    console.log(req.body);

    console.log("========================");
    let category_id = req.params.id;
    console.log(category_id);
    console.log("========================");
    
    let category_name = req.body.category_name;
  
    var results = {};

    //validation
    if ( category_name == "" ) {

      results.error = "category name is required!";
    } else {
      
        // connection.connect(function (err) {
        connection.getConnection(function (err, connect) {
          if (err) throw err;

            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            today = yyyy + '-' + mm + '-' + dd;

          
          $query = "UPDATE `category` SET `category_name`=? WHERE `category_id` = ?"

          connect.query($query, [category_name, Number(category_id)],
            function (err, result) {
              if (err) throw err;
              console.log(err);
              console.log(result);
            }
          );

          connect.release();
        });

        results.statusText = "Category Updated Successfully";
        results.statusCode = "200"; 
      
    }

    console.log(results);
    res.send(results);
  },

  delete: function (req, res) {

    connection.getConnection(function (err, connect) {
      
        if (err) throw err;

        
        $query = "delete from category where category_id = ?";
        connect.query($query,[req.body.category_id], function (err, result) {
            if (err) {
              
                res.render("admin/categories/index", { msg: 'you can not delete this category (fk on another table)', user: req.session.user });

            };
            console.log(err);
            console.log(result);

            connect.release();

            res.render("admin/categories/index", { success: 'category deleted successfully', user: req.session.user });

        });

    });

  },

  showAll: function (req, res) {

    connection.getConnection(function (err, connect) {
      
        if (err) throw err;

        $query = "select * from category";

        connect.query($query, function (err, result) {
            if (err) throw err;
            console.log(err);
            console.log(result);

            connect.release();
   

            res.render("admin/categories/index", { categories: result, user: req.session.user });
        });
    });
  },
 

  router: function (app, parserBody) {
    app.get("/api/dashboard/categories", this.showAll);

    app.get("/api/dashboard/categories/add", this.getAdd);
    app.post("/api/dashboard/categories/add", parserBody, this.postAdd);

    app.get("/api/dashboard/categories/edit/:id", this.edit);
    app.post("/api/dashboard/categories/edit/:id", parserBody,this.postEdit);

    app.delete("/api/dashboard/categories", parserBody,  this.delete);
  },
};

exports.controller = category;
