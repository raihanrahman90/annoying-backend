const connection = require('../connection');
const authenticate = require('../authenticate');
const { connect } = require('../connection');

exports.create = (req,res,next)=>{
    connection.query(
        `INSERT INTO tb_edukasi value(0,?,?,?,?, now())`,
        [req.user.id_user, req.body.judul, req.body.isi, req.body.gambar],
        (error, result)=>{
            if(error){
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.send({success:false, message:error.message})
            }else{
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.send({success:true, result:results})
            }
        }
    )
}

exports.getAll = (req,res,next)=>{
    connection.query(
        `SELECT * FROM tb_edukasi`,
        [req.user.id_user, req.body.judul, req.body.isi, req.body.gambar],
        (error, result)=>{
            if(error){
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.send({success:false, message:error.message})
            }else{
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.send({success:true, result:results})
            }
        }
    )
}

exports.getById=(req,res,next)=>{
    //mengambil data id_user agar hanya pembuat yang bisa mengubah artikel
    connection.query(
        `SELECT id_user from tb_edukasi where id_edukasi=?`,
        [req.params.id_edukasi],
        (error,result)=>{
            if(error){
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.send({success:false, message:error.message})
            }else{
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.send({success:true, result:result})
            }
        }
    )
}
exports.updateById=(req,res,next)=>{
    //mengambil data id_user agar hanya pembuat yang bisa mengubah artikel
    connection.query(
        `SELECT id_user from tb_edukasi where id_edukasi=?`,
        [req.params.id_edukasi],
        (error,result)=>{
            if(error){
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.send({success:false, message:error.message})
            }else{
                if(!rows || !rows.length){
                    res.statusCode = 404
                    res.setHeader('Content-Type', 'application/json')
                    res.send({success:false, message:'Artikel tidak ditemukan'})
                }else if(req.user.id_user != result[0].id_user && req.user.hak_akses != 'Super Admin'){
                    res.statusCode = 403
                    res.setHeader('Content-Type', 'application/json')
                    res.send({success:false, message:'Anda tidak memiliki akses'})
                }else{
                    connection.query(
                        `UPDATE tb_edukasi set ? where id_edukasi=?`,
                        [req.body, req.params.id_edukasi],
                        (error, result)=>{
                            if(error){
                                res.statusCode = 500
                                res.setHeader('Content-Type', 'application/json')
                                res.send({success:false, message:error.message})
                            }else{
                                res.statusCode = 200
                                res.setHeader('Content-Type', 'application/json')
                                res.send({success:true, result:result})
                            }
                        }
                    )
                }
            }
        }
    )
}
exports.deleteById=(req,res,next)=>{
    //mengambil data id_user agar hanya pembuat yang bisa mengubah artikel
    connection.query(
        `SELECT id_user from tb_edukasi where id_edukasi=?`,
        [req.params.id_edukasi],
        (error,result)=>{
            if(error){
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.send({success:false, message:error.message})
            }else{
                if(!rows || !rows.length){
                    res.statusCode = 404
                    res.setHeader('Content-Type', 'application/json')
                    res.send({success:false, message:'Artikel tidak ditemukan'})
                }else if(req.user.id_user != result[0].id_user && req.user.hak_akses != 'Super Admin'){
                    res.statusCode = 403
                    res.setHeader('Content-Type', 'application/json')
                    res.send({success:false, message:'Anda tidak memiliki akses'})
                }else{
                    connection.query(
                        `DELETE FROM tb_edukasi where id_edukasi=?`,
                        [req.params.id_edukasi],
                        (error, result)=>{
                            if(error){
                                res.statusCode = 500
                                res.setHeader('Content-Type', 'application/json')
                                res.send({success:false, message:error.message})
                            }else{
                                res.statusCode = 200
                                res.setHeader('Content-Type', 'application/json')
                                res.send({success:true, result:result})
                            }
                        }
                    )
                }
            }
        }
    )
}