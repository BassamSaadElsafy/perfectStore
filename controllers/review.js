var req = require("../config.js");

let connection = req.connection;

var review = {

  addReview : function(req, res){

    console.log("==============================");
    console.log(req.body);
    console.log("==============================");

    connection.getConnection(function (err, connect) {
    
      let query = `select * from products where product_id = ${req.body.product_id}`;
      $query = "select * from products where product_id = ? ; select * from reviews where product_id = ? ; select * from users where admin = '0'";


      if (err) throw err;          
      connect.query(
         query + "; insert into reviews (`user_id`, `product_id`, `content`,`created_at`, `updated_at`) values (?, ?, ?, CURRENT_DATE , CURRENT_DATE) ; select * from reviews where product_id = ? ; select * from users where admin = '0'"  ,
        [Number(req.body.user_id), Number(req.body.product_id), req.body.content , Number(req.body.product_id)],
        function (err, result) {
          if (err) throw err;
          console.log(err);
          console.log(result[0][0]);
          console.log(result[1]);
          console.log(result[2]);
          console.log(result[3]);

          connect.release();

          // res.render("site/product_details", { product : result[0][0],reviews: result[1] , users : result[2] , page_name : "", 'cart' : req.session.cart , total_price : req.session.total_price, user : req.session.customer});

          res.render("site/product_details", { product : result[0][0] ,reviews: result[2] , users : result[3] , page_name : "", 'cart' : req.session.cart , total_price : req.session.total_price, user : req.session.customer , msg : 'Comment added successfully'});
          // res.redirect(`/product/${req.body.product_id}`);
        }
      );

      
    });
  },

  router: function (app, parserBody) {

    app.post("/product/:id",parserBody,  this.addReview);
   
  },
};

exports.controller = review;
