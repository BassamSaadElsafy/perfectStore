var req = require("../config.js");

let connection = req.connection;

var contact = {
  
  showAll: function (req, res) {

    connection.getConnection(function (err, connect) {
      
        if (err) throw err;

        $query = "select * from contacts";

        connect.query($query, function (err, result) {
            if (err) throw err;
            console.log(err);
            console.log(result);

            connect.release();
   
            res.render("admin/contacts/index", { contacts: result , user: req.session.user  });

        });
    });
  },

  delete: function (req, res) {

    connection.getConnection(function (err, connect) {
      
        if (err) throw err;

        $query = "delete from contacts where id = ?";

        connect.query($query,[req.body.contact_id], function (err, result) {
            if (err) throw err;
            console.log(err);
            console.log(result);

            connect.release();

            res.render("admin/contacts/index", { success: 'contact message deleted successfully' });
        });
    });

  },


  router: function (app, parserBody) {
    app.get("/api/dashboard/contacts", this.showAll);

    app.delete("/api/dashboard/contacts", parserBody,  this.delete);
  },
};

exports.controller = contact;
