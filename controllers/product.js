var req = require("../config.js");

/*---------Middleware authentication---------*/
const authorize = require("../authorization-middleware.js");


/*-------------for deleting files----------------*/
const fs = require('fs')
/*-----------------------------------------------*/

var product_added = true;

/*-------------------------------------------------------------*/
const multer = require('multer');
const path = require('path');
// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){        
    if(product_added){   //product_added ***check if product inserted into db first, before saving image
    return cb(null,true);}
    else{
      cb('Error: Something went wrong with insertion product into database!!');
    }
  } else {
    cb('Error: Images Only!');
  }
}

const upload = multer({
  storage: storage,
  limits:{fileSize: 10000000},       //byte
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
});

/*-------------------------------------------------------------*/



let connection = req.connection;


//delete image function
function delete_img(img_path){
  const path = './public/uploads/'+img_path;

  fs.unlink(path, (err) => {
    if (err) {
      console.error(err)
      
    }else{
      console.log("img deleted");
    }

});
}


var product = {

  getAdd: function (req, res) {

    connection.getConnection(function (err, connect) {
      if (err) throw err;

      $query = "select * from category";

      connect.query( $query, 
        function (err, result) {
          if (err) throw err;
          console.log(err);
          console.log(result);

          connect.release();

          res.render("admin/products/add", { categories : result, user: req.session.user});

        }
      );

    });

  },

  /*-----it is working for me-----*/
  deleteImg: function (req, res) {
    const path = './public/uploads/test.png'

  fs.unlink(path, (err) => {
    if (err) {
      console.error(err)
      
    }else{
      console.log("img deleted");
    }

  //file removed
})

  },
  postAdd: function (req, res) {

    let product_name = req.body.product_name;
    let desc         = req.body.desc;
    let price        = req.body.price;
    let stock        = req.body.stock;
    let product_img  = req.file.filename;                     //get file name (image name)
    let category_id  = req.body.category_id;
  
    var results = {};

    //validation
    if ( product_name == '' || desc == '' || price == '' || stock == '' || category_id == '' || product_img == '') {

      res.render('admin/products/add',{msg :  "All Fields Are Required!" , user: req.session.user });

    } else {
    
          connection.getConnection(function (err, connect) {
          if (err) throw err;

          $query = "INSERT INTO `products`(`product_name`, `desc`, `price`, `stock`, `photo`, `category_id`, `created_at`, `updated_at`) VALUES (?,?,?,?,?,?, CURRENT_DATE, CURRENT_DATE) ; select * from category"

          connect.query( $query, [product_name, desc, Number(price), Number(stock), product_img, Number(category_id)],
            function (err, result) {
              if (err) throw err;
              console.log(err);
              console.log(result[0]);

              connect.release();

              res.render('admin/products/add',{success : "Product Added Successfully", categories : result[1] , user: req.session.user});
            }
          );

        });

        

    }


  },


  edit: function (req, res) {

    console.log(req.params.id);

    let product_id = req.params.id;


    connection.getConnection(function (err, connect) {
      
        if (err) throw err;

        connect.query("select * from products where product_id = ?;select * from category", [product_id], function (err, result) {
            if (err) throw err;
            console.log(err);
            console.log(result[0]);
            console.log(result[1]);

            connect.release();

            res.render("admin/products/edit", { product: result[0] , categories: result[1], user: req.session.user});
        
        });
    });

  },

  postEdit: function (req, res) {
    console.log(req.body);

    let product_id = req.params.id;
    console.log(product_id);
    
    let product_name = req.body.product_name;
    let desc  = req.body.desc;
    let price = req.body.price;
    let stock = req.body.stock;
    let photo = req.body.photo;
    let category_id = req.body.category_id;
  
    var results = {};

    //validation
    if ( product_name == '' || desc == '' || price == '' || stock == '') {

      results.error = "all fieldes are required!";

    } else {
      
        connection.getConnection(function (err, connect) {
          if (err) throw err;

            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            today = yyyy + '-' + mm + '-' + dd;

          
          $query = "UPDATE `products` SET `product_name`=?,`desc`=?,`price`= ?,`stock`= ?,`category_id`=1,`updated_at`=? WHERE product_id = ?";

          connect.query($query, [product_name, desc, Number(price), Number(stock), today , Number(product_id)],
            function (err, result) {
              if (err) throw err;
              console.log(err);
              console.log(result);
            }
          );

          connect.release();
        });

        results.statusText = "Product Updated Successfully";
        results.statusCode = "200"; 
      
    }

    console.log(results);
    res.send(results);
  },

  
  delete: function (req, res) {

    console.log("-------------------------------------");
    console.log("-------------------------------------");
    console.log(req.body.product_id);
    console.log(req.body.image_path);
    console.log("-------------------------------------");
    console.log("-------------------------------------");
   

    connection.getConnection(function (err, connect) {
      
        if (err) throw err;

        $query = "delete from products where product_id = ?";

        connect.query($query,[req.body.product_id], function (err, result) {
            if (err) throw err;
            console.log(err);
            console.log(result);

            connect.release();


            delete_img(req.body.image_path);

            res.render("admin/products/index", { success: 'product deleted successfully' });
        });
    });

  },

  showAll: function (req, res) {

    connection.getConnection(function (err, connect) {
      
        if (err) throw err;

        $query = "select * from products";

        connect.query($query, function (err, result) {
            if (err) throw err;
            console.log(err);
            console.log(result);

            connect.release();
   

            res.render("admin/products/index", { products: result, user: req.session.user });
        });
    });
  },
  show: function (req, res) {},


  router: function (app, parserBody) {
    app.get("/api/dashboard/products",authorize(), this.showAll);
    app.get("/delete/img", this.deleteImg);

    app.get("/api/dashboard/products/add",authorize(), this.getAdd);
    app.post("/api/dashboard/products/add",upload.single("product_img"), this.postAdd);

    app.get("/api/dashboard/products/edit/:id",authorize(), this.edit);
    app.post("/api/dashboard/products/edit/:id", parserBody,this.postEdit);

    app.delete("/api/dashboard/products", parserBody,  this.delete);
  },
};

exports.controller = product;
