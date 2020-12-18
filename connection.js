var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "tambakin",
  password: "tambaktanpain",
  database:"tambakin_annoying"
});

con.connect(function (err){
    if(err) throw err;
    else console.log("Koneksi berhasil")
});

module.exports = con;