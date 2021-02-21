var req = require("../config.js");

let connection = req.connection;

var cart = {
  showCart: function (req, res) {
    res.send("cartsssssss");

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

        res.render("admin/categories/edit", {
          category: result,
          user: req.session.user,
        });
      });
    });
  },

  postCheckout: function(req, res){

    console.log(req.session.cart);
    
    connection.getConnection(function (err, connect) {

      if (err) throw err;
      

      $query = "INSERT INTO `orders`(`total_price`, `user_id`, `created_at`) VALUES (? , ?, CURRENT_DATE)";

      connect.query($query,[req.session.total_price , req.session.customer.user_id ] , function (err, result) {
        if (err) throw err;
        console.log(err);
  
        connect.release();

      });
    });


    //insert products into order_products
    connection.getConnection(function (err, connect) {

      if (err) throw err;

      for ( var g = 0 ; g < req.session.cart.length ; g++ ){

      $query = "INSERT INTO `order_products`(`order_id`, `product_id`, `quantity`) VALUES ( (SELECT `order_id` FROM `orders` ORDER BY order_id DESC LIMIT 1) ,? , ?);";

      connect.query($query,[req.session.cart[g][0], req.session.cart[g][1]] , function (err, result) {

        if (err) throw err;
        console.log(err);
        console.log(result);

          });
        }//end of loop(products)

        connect.release();

        // req.session.destroy();
        delete req.session.cart;
        delete req.session.total_price;

    });

    connection.getConnection(function (err, connect) {
      if (err) throw err;

      $query = "select * from products";

      connect.query( $query, 
        function (err, result) {
          if (err) throw err;
          console.log(err);
          console.log(result);

          connect.release();

          res.render("site/index", { products : result, page_name : "home" , msg : "Order Added Successfully" , user : req.session.customer});

        }
      );

    });


  },

  removeProduct : function(req, res){

    let product_id =  req.body.product_id;

    for(var i = 0 ; i < req.session.cart.length ; i ++){

      if( product_id == req.session.cart[i][0]){
        //remove from array
        //calc new total
        req.session.total_price -= req.session.cart[i][1] * req.session.cart[i][2].price;  

        req.session.cart.splice(i,1);

      }

    }

    res.render("site/cart", {page_name : "cart" , 'cart' : req.session.cart , total_price : req.session.total_price , user : req.session.customer});


  },

  addToCart: function (req, res) {

    console.log(req.body);

    let totalprice = 0;

    /*
    

    [product_id,
     quantity,
     {details}
    ]
    
    
    */
    
    let product = [      
      req.body.product_id,
      1,
      
      {product_id: req.body.product_id,
      product_name: req.body.product_name,
      price: req.body.price,
      }
      // quantity: req.body.quantity,
    ];

    console.log(product);

    if (typeof req.session.cart === 'undefined'){

      req.session.cart = [];
      req.session.cart.push(product);
      
     } else {

      let pro_id = product[0];

      var flag= 0;

      for( var t = 0 ; t < req.session.cart.length ; t++ ){

        if(pro_id == req.session.cart[t][0]){

          console.log('exist');

          req.session.cart[t][1] +=1;

          flag = 1;

          break;

        }

      }

      if(!flag){
       
          req.session.cart.push(product);
      }
        
    }

    //calculate total
    for (var i = 0; i < req.session.cart.length; i++) {
      totalprice += req.session.cart[i][1] * req.session.cart[i][2].price;
    }

    console.log("---------------------------------------------");
    console.log(req.session.cart); 
    console.log(totalprice); 
    console.log("---------------------------------------------");

    req.session.total_price = totalprice;

    res.render("site/shop" , {page_name : 'shop'});
  },

  router: function (app, parserBody) {
    // app.get("/cart/show", this.showCart);
    app.post("/add-to-cart",parserBody, this.addToCart);

    app.post("/post-checkout",parserBody, this.postCheckout);

    app.delete("/remove-product" ,parserBody,  this.removeProduct);
  },
};

exports.controller = cart;
