let mysql = require("mysql");

// const con = mysql.createConnection({
const con  = mysql.createPool({
    connectionLimit : 10,
    host:"localhost",
    user:"root",
    password:"",
    database:"ecommerce",
    multipleStatements: true
    // multipleStatements: true                   //enable you to make more than one query within the same connection 
})

module.exports = { 
     connection: con 
} 