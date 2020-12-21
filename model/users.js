const connection = require('../connection');
const bcrypt = require('bcrypt')
const mailer = require('./mailer');
const authenticate = require('../authenticate')
exports.create = async (req, res)=>{
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    connection.query(
        `INSERT INTO user (nama, username, password) value (?,?,?)`,
        [req.body.nama, req.body.username, hashedPassword],
        async (error,result)=>{
            if(error){
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.send({success:false, message:error.message});
            }else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success:true});
            }
        }
    )
}

exports.cekUsername = (req,res,next)=>{
    connection.query(
        `select * from user where username=?`,
        [req.body.username],
        (error, result)=>{
            if(err){
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.send({success:false, message:"Terjadi kesalahan"});
            }else if(result.length > 0){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.send({success:false, message:"Username sudah terdaftar"});
            }else{
               next()
            }
        }
    )
}
exports.getAll = (req, res)=>{
    connection.query(
        `SELECT * from user`,
        (error,result)=>{
            if(error){
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json');
                res.json({success:false, message:'Terjadi kesalahan'})
            }else{
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json');
                res.json({success:true, result:result})
            }
        }
    )
}

exports.updateById = async (req,res)=>{
    if(req.body.password){
        req.body.password = await bcrypt.hash(req.body.password, 10)
    }
    connection.query(
        'update user set ? where idUser =?',
        [req.body, req.params.idUser],
        (error,result)=>{
            if(error){
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({success:false, message: "Terjadi kesalahan"});
            }else{
                if(result.affectedRows==1){
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true,  message: 'successfully update!'});
                }else{
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({message: "Akun tidak ditemukan"});
                }
            }
        }
    )
}
exports.updateMyData = async (req,res,next)=>{
    if(req.body.password){
        req.body.password = await bcrypt.hash(req.body.password, 10)
    }
    connection.query(
        'update user set ? where idUser =?',
        [req.body, req.user.idUser],
        (error,result)=>{
            if(error){
                console.log(error.message)
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({success:false, message: "Terjadi kesalahan"});
            }else{
                if(result.affectedRows==1){
                    next()
                }else{
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({message: "Akun tidak ditemukan"});
                }
            }
        }
    )
}
exports.getById = (req,res)=>{
    connection.query(
        'select * from user where idUser =?',
        [req.params.idUser],
        (error,result)=>{
            if(error){
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({message: error.message});
            }else{
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json');
                res.json({success:true, result:result[0]})
            }
        }
    )
}
exports.deleteById = (req, res)=>{
    connection.query(
        'delete from user where idUser=?',
        [req.params.idUser],
        (error,result)=>{
            if(error){
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json');
                res.json({success:false, message:'Terjadi kesalahan'})
            }else{
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json');
                res.json({success:true})
            }
        }
    )
}
exports.login = (req, res, next)=>{
    connection.query(
        `SELECT user.* from user 
        where username=?`,
        [req.body.username],
        async (error, rows)=>{ 
            if(!rows || !rows.length){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: false, message:'Username tidak ditemukan salah'});
            }else{
                if(await bcrypt.compare(req.body.password, rows[0].password)){
                    var token = authenticate.getToken({
                        idUser : rows[0].idUser,
                        username : rows[0].username,
                        nama : rows[0].nama,
                        hakAkses:'User'
                    });
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, token: token, status: 'You are successfully logged in!'});
                }else{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: false, message:'Password salah'});
                }
            }
        }
    )
}
exports.getNewToken = (req,res, next)=>{
        connection.query(
            "SELECT * from user where idUser=?",
            [req.user.idUser],
            (error, rows)=>{
                if(error){
                    console.log(error.message)
                    res.statusCode = 500
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success:false, message:'Terjadi kesalahan'})
                }else{
                    var token = authenticate.getToken({
                        idUser : rows[0].idUser,
                        username : rows[0].username,
                        nama : rows[0].nama,
                        hakAkses:'User'
                    });
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, token: token, status: 'You are successfully logged in!'});
                }
                
            }
        )
}
exports.getMyData = (req,res)=>{
    connection.query(
        'select * from user where idUser =?',
        [req.user.idUser],
        (error,result)=>{
            if(error){
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({message: error.message});
            }else{
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json');
                res.json({success:true, result:result[0]})
            }
        }
    )

}
exports.kirimEmail = (req,res,next)=>{
    mailer.customEmail(req.params.email, req.body.subject, req.body.isi)
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true});
}