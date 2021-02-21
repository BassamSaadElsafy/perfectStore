module.exports = () => {

    return (req, res, next) => {

        if (typeof req.session.success == 'undefined'){
            req.session.success = false;
        } 

        console.log("Authorization Middleware");

        if(!req.session.success ){
           
            res.redirect('/api/login');
        
        }else{
            next();            //continue if authorized
        }

    };

};

