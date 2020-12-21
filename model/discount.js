var connection = require('../connection');
exports.create = (req,res,next)=>{
    connection.query(
        `INSERT INTO discount value(0,?,?,?,?,?)`,
        [req.user.idAdmin, req.body.kodeDiscount, req.body.discount, req.body.mulai, req.body.berakhir],
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
        `SELECT discount.*, admin.username FROM discount 
            left join admin on discount.idAdmin = admin.idAdmin`,
        (error, result)=>{
            if(error){
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.json({success:false, message:"Terjadi kesalahan"})
            }else{
                var conver = result.map(data=>{return {...data, mulai:new Date(data.mulai+1).toLocaleDateString(), berakhir:new Date(data.berakhir+1).toLocaleDateString()}})
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json({success:true, result:conver})
            }
        }
    )
}

exports.getById = (req, res,next)=>{
    connection.query(
        `SELECT * FROM discount
            left join admin on admin.idAdmin = discount.idAdmin
            where idDiscount = ?`,
        [req.params.idDiscount],
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
        `DELETE FROM discount where idDiscount=?`,
        [req.params.idDiscount],
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
        `Update discount set ? where idDiscount=?`,
        [req.body, req.params.idDiscount],
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
exports.checkKodeDiscount = (req,res, next)=>{
    connection.query(
        `SELECT discount from discount where kodeDiscount=? and mulai< now() and berakhir>now()`,
        [req.params.kodeDiscount],
        (error, result)=>{
            if(error){
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.json({success:false, message:error.message})
            }else{
                if(result[0]){
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json({success:true, discount:result[0].discount})
                }else{
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json({success:false, message:"Kode Discount Tidak ditemukan atau sudah kada luarsa"})
                }
            }
        }
    )
}