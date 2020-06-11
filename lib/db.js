var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'uranodb.cdoj8q3yq6ek.us-east-1.rds.amazonaws.com',
    user:'admin',
    password:'T3csup3844',
    database:'contactos',
    port:'3306'
});
connection.connect(function(error){
    if(!!error){
        console.log(error);
    }else{
        console.log('Conectado!');
    }
});

module.exports = connection;