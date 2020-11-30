const connection = require('../connection');
const bcrypt = require('bcrypt')
const mailer = require('./mailer');
const authenticate = require('../authenticate')

exports.create = (req,res)=>{
    if(req.body.id_akun=='null'){req.body.id_akun=null}
    if(req.body.id_roi=='null'){req.body.id_roi=null}
    connection.query(
        `INSERT INTO tb_dokumen value(0,?,?,?,now())`,
        [req.body.id_akun, req.body.id_roi, req.body.dokumen],
        (error, result)=>{
            if(error){
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.send({success:false, message:error.message})
            }else{
                res.statusCode = 200
                res.setHeader('Content-Type','application/json')
                res.send({success:true})
            }
        }
    )
}

exports.getAll = (req,res,next)=>{
    connection.query(
        `SELECT * FROM tb_dokumen order by id_dokumen desc`,
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

exports.getById=(req,res,next)=>{
    //mengambil data id_user agar hanya pembuat yang bisa mengubah artikel
    connection.query(
        `SELECT * from tb_dokumen 
            left join tb_akun_baru on tb_akun_baru.id_akun = tb_dokumen.id_akun
            left join tb_roi on tb_roi.id_roi = tb_dokumen.id_roi
            where id_edukasi=?`,
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