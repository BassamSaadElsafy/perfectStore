addReview:function(req, res){
    connection.connect(function (err) {
      if (err) throw err;          
      connection.query(
        "insert into reviews (`user_id`, `product_id`, `content`,created_at`, `updated_at`) values (?, ?, ?, CURRENT_DATE , CURRENT_DATE);",
        [req.body.user_id, req.body.product_id, req.body.content],
        function (err, result) {
          if (err) throw err;
          console.log(err);
          console.log(result);
        }
      );
      res.render("/productsdetails",result)
    });
});

 

showReviews:function(req, res){
    connection.connect(function (err) {
      if (err) throw err;          
      connection.query(
        "SELECT user_id, content, created_at FROM reviews WHERE product_id = ?",
        [req.body.product_id],
        function (err, result) {
          if (err) throw err;
          console.log(err);
          console.log(result);
        }
      );
      res.render("/productsdetails",result)
    });
});

 

delReview:function(req, res){
    connection.connect(function (err) {
      if (err) throw err;          
      connection.query(
        "DELETE FROM reviews WHERE user_id = ? AND product_id = ?;",
        [req.body.user_id, req.body.product_id],
        function (err, result) {
          if (err) throw err;
          console.log(err);
          console.log(result);
        }
      );
      res.render("/productsdetails",result)
    });
});

 

async function addReview(event)
{
  let review = {
    product_id: product_id.value,
    user_id:    user_id.value,
    content:    content.value
  }
  fetch('/productdetails/', {
    method: 'POST',
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(review)
  })
  .then(response => response.json())
  .then(result => {
    console.log('Success:', result);
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

 

async function delReview(event)
{
  let review = {
    product_id : product_id.value;
    user_id: user_id.value;
  }
  fetch('', {
    method: 'DELETE',
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(review)
  })
  .then(response => response.json())
  .then(result => {
    console.log('Success:', result);
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

 

async function showReviews(event)
{
  let reviews = {
    product_id : product_id.value;
  }
  fetch('', {
    method: 'GET',
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(reviews)
  })
  .then(response => response.json())
  .then(result => {
    console.log('Success:', result);
  })
  .catch(error => {
    console.error('Error:', error);
  });
}