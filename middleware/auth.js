const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['authorization'];

    console.log(token);
  
    if(!token){
        res.redirect('/api/login');
    }else{
        next();
    }
  
};