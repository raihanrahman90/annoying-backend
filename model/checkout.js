const connection = require('../connection');
exports.create = async (req, res)=>{
    connection.query(
        `INSERT INTO checkout value (0,?,?,?,?,?,?,?,?,?,null,null)`,
        [req.user.idUser, req.body.provinsi, req.body.kota, req.body.kecematan, req.body.kelurahan, req.body.alamat, req.body.atasNama, req.body.noTelpon, req.body.resi, req.body.bukti],
        (error,result)=>{
            console.log(req.body)
            if(error){
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.send({success:false, message:error.message});
            }else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success:true, id:result.insertId});
            }
        }
    )
}