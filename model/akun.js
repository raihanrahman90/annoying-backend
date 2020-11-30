const connection = require('../connection');
const bcrypt = require('bcrypt')
const mailer = require('./mailer');
const authenticate = require('../authenticate')
const jwt = require('jsonwebtoken')
const secretKey = 'jaya jaya jaya'
exports.create = async (req, res)=>{
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    connection.query(
        `INSERT INTO user (nama, username, password, jenis_kelamin, status, daftar_tunggu) value (?,?,?,?,?,?)`,
        [req.body.nama, req.body.username, hashedPassword, req.body.jenis_kelamin, 0, 0],
        async (err,result)=>{
            if(err){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success:false, message: "Email telah digunakan"});
            }else{
                var token = jwt.sign({username:req.body.username, idUser:result.insertId}, secretKey,
                    {expiresIn: 3600});
                mailer.register(req.body.nama, req.body.username, token)
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json');
                res.json({success:true})
            }
        }
    )
}

exports.getAllAkun = (req, res)=>{
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
exports.getById = (req,res )=>{
    connection.query(
        `select * from user where idUser = ?`,
        [req.params.idUser],
        (error,result)=>{
            if(error){
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json');
                res.json({success:false, message:'Terjadi kesalahan'})
            }else{
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json');
                res.json({success:true, result:result[0]})
            }
        }
    )
}
exports.kirimEmail = (req, res)=>{
    var token = jwt.sign({username:req.user.username, idUser:req.user.idUser}, secretKey,
        {expiresIn: 3600});
    mailer.register(req.user.nama, req.user.username, token)
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');
    res.json({success:true})
}
exports.aktivasi = (req, res, next)=>{
    jwt.verify(req.body.token, secretKey, (err,user)=>{
        if(err) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({success:false, message: "Token tidak ditemukan"});  
        }else{
            connection.query(
                `update user set status='1' where username=?`,
                [user.username],
                (err, result2)=>{
                    if(err){
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success:false, message: err.message});
                    }else{
                        req.user = user
                        next()
                    }
                }
            )
        }
    })
}

exports.updateById = (req,res)=>{
    connection.query(
        'update tb_akun set ? where idUser =?',
        [req.body, req.params.idUser],
        (err,res)=>{
            if(err){
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({message: "Terjadi kesalahan"});
            }else{
                if(res.affectedRows==1){
                    connection.query(
                        `SELECT tb_akun.*, tb_akun_data.kelengkapan from tb_akun 
                        left join tb_akun_data on tb_akun.idUser = tb_akun_data.idUser 
                        where idUser=?`,
                        [req.params.idUser],
                        (req, res)=>{
                            var token = authenticate.getToken({
                                idUser : res[0].idUser,
                                username : res[0].username,
                                nama : res[0].nama,
                                status : res[0].status,
                                kelengkapan : res[0].kelengkapan,
                                daftar_tunggu : res[0].daftar_tunggu
                            });
                        }
                    )
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, token: token, status: 'You are successfully logged in!'});
                }else{
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({message: "Akun tidak ditemukan"});
                }
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
                res.json({success: false, message:'Username tidak ditemukan'});
            }else{
                if(await bcrypt.compare(req.body.password, rows[0].password)){
                    var token = authenticate.getToken({
                        idUser : rows[0].idUser,
                        username : rows[0].username,
                        nama : rows[0].nama
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
            (error, result)=>{
                if(error){
                    res.statusCode = 500
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success:false, message:'Terjadi kesalahan'})
                }else{
                    var token = authenticate.getToken({
                        idUser : result[0].idUser,
                        username : result[0].username,
                        nama : result[0].nama
                    });
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, token: token, status: 'You are successfully logged in!'});
                }
                
            }
        )
}
exports.getMyData = (req,res,next)=>{
    connection.query(
        `SELECT * from user where idUser=?`,
        [req.user.idUser],
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
exports.updateMyData = (req,res,next)=>{
    if(req.body.nama_ibu_kandung=='null'|| req.body.nama_ibu_kandung=='undefined'){req.body.nama_ibu_kandung=null}
    connection.query(
        `UPDATE user set ? where idUser=?`,
        [req.body, req.user.idUser],
        (error, result)=>{
            if(error){
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.json({success:false, message:error, body:req.body})
            }else{
                next()
            }
        }
    )
}

