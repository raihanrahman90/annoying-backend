var connection = require('../connection');
exports.create = (req,res,next)=>{
    connection.query(
        `INSERT INTO ulasan value(0,?,?,?,?)`,
        [req.user.idUser, req.body.idCheckout, req.body.nilai, req.body.ulasan],
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
        `SELECT ulasan.*, user.username FROM ulasan 
            left join user on ulasan.idUser = user.idUser`,
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
        `SELECT * FROM ulasan
            left join user on user.idUser = ulasan.idUser
            where idUlasan = ?`,
        [req.params.idUlasan],
        (error, result)=>{
            if(error){
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.json({success:false, message:"Terjadi kesalahan"})
            }else{
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json({success:true,result:result[0]})
            }
        }
    )
}

exports.deleteById = (req, res, next)=>{
    connection.query(
        `DELETE FROM ulasan where idUlasan=?`,
        [req.params.idUlasan],
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
        `Update ulasan set ? where idUlasan=?`,
        [req.body, req.params.idUlasan],
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