var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "annoying_brand"
});

con.connect(function (err){
    if(err) throw err;
    else console.log("Koneksi berhasil")
});

module.exports = con;