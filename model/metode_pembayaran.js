var connection = require('../connection');
exports.create = (req,res,next)=>{
    connection.query(
        `INSERT INTO tb_metode_pembayaran value(0,?,?,?)`,
        [req.body.nama_metode, req.body.no_akun_pembayaran, req.body.instruksi],
        (error, result)=>{
            if(error){
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.json({success:false, message:"Terjadi kesalahan"})
            }else{
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json({success:true})
            }
        }
    )
}

exports.getAll = (req,res,next)=>{
    connection.query(
        `SELECT * FROM tb_metode_pembayaran`,
        (error, result)=>{
            if(error){
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.json({success:false, message:"Terjadi kesalahan"})
            }else{
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json({success:true, result:result})
            }
        }
    )
}

exports.getById = (req, res,next)=>{
    connection.query(
        `SELECT * FROM tb_metode_pembayaran where id_metode_pembayaran=?`,
        [req.params.id_metode_pembayaran],
        (error, result)=>{
            if(error){
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.json({success:false, message:"Terjadi kesalahan"})
            }else{
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json({success:true,result:result})
            }
        }
    )
}

exports.deleteById = (req, res, next)=>{
    connection.query(
        `DELETE FROM tb_metode_pembayaran where id_metode_pembayaran=?`,
        [req.params.id_metode_pembayaran],
        (error, result)=>{
            if(error){
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.json({success:false, message:"Terjadi kesalahan"})
            }else{
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json({success:true})
            }
        }
    )
}
exports.updateById = (req,res, next)=>{
    connection.query(
        `Update tb_metode_pembayaran set ? where id_metode_pembayaran=?`,
        [req.body, req.params.id_metode_pembayaran],
        (error, result)=>{
            if(error){
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.json({success:false, message:"Terjadi kesalahan"})
            }else{
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json({success:true})
            }
        }
    )
}