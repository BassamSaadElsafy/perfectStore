var req = require("../config.js");

let connection = req.connection;

var order = {
  
  showAll: function (req, res) {

    connection.getConnection(function (err, connect) {
      
        if (err) throw err;

        $query = "select * from orders ; select * from users where admin = '0'";

        connect.query($query, function (err, result) {
            if (err) throw err;
            console.log(err);
            console.log(result);

            connect.release();

            console.log(result[0]);
            console.log("====================================");

            console.log(result[1]);
   
            res.render("admin/orders/index", { orders: result[0] , users : result[1] , user: req.session.user  });

        });
    });
  },

  delete: function (req, res) {


    //delete al product related to this order
    
    connection.getConnection(function (err, connect) {
      
      if (err) throw err;

      $query = "delete from order_products where order_id = ?";

      connect.query($query,[req.body.order_id], function (err, result) {
          if (err){ 
              res.render("admin/orders/index", { error: 'something went wrong!' });
          }
          console.log(err);
          
          console.log(result);

          connect.release();

      });
  });

    connection.getConnection(function (err, connect) {
      
        if (err) throw err;

        $query = "delete from orders where order_id = ?";

        connect.query($query,[req.body.order_id], function (err, result) {
            if (err){ 
                res.render("admin/orders/index", { error: 'can not delete this order, you should delete its products first, then delete the order.' });
            }
            console.log(err);
            
            console.log(result);

            connect.release();

            console.log("order deleted successfully");

            res.render("admin/orders/index", { success: 'order deleted successfully' });
        });
    });

  },


  router: function (app, parserBody) {
    app.get("/api/dashboard/orders", this.showAll);

    app.delete("/api/dashboard/orders", parserBody,  this.delete);
  },
};

exports.controller = order;
