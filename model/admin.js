const connection = require('../connection');
const bcrypt = require('bcrypt')
const mailer = require('./mailer');
const authenticate = require('../authenticate')
exports.create = async (req, res)=>{
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    connection.query(
        `INSERT INTO admin (nama, username, password, hakAkses) value (?,?,?,?)`,
        [req.body.nama, req.body.username, hashedPassword, req.body.hakAkses],
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
        `select * from admin where username=?`,
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
        `SELECT * from admin`,
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
        'update admin set ? where id_user =?',
        [req.body, req.params.id_user],
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
exports.getById = (req,res)=>{
    connection.query(
        'select * from admin where idAdmin =?',
        [req.params.idAdmin],
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
        'delete from admin where id_user=?',
        [req.params.id_user],
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
        `SELECT admin.* from admin 
        where username=?`,
        [req.body.username],
        async (error, rows)=>{ 
            if(!rows || !rows.length){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: false, message:'Username tidak ditemukan salah'});
            }else{
                if(await bcrypt.compare(req.body.password, rows[0].password)){
                    console.log(rows[0])
                    var token = authenticate.getToken({
                        id_user : rows[0].id_user,
                        username : rows[0].username,
                        nama : rows[0].nama,
                        hak_akses:rows[0].hak_akses
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
            "SELECT tb_akun.*, tb_akun_data.kelengkapan from tb_akun left join tb_akun_data on tb_akun.id_akun = tb_akun_data.id_akun where id_akun=?",
            [req.user.id_akun || req.body.id_akun],
            (req, res)=>{
                var token = authenticate.getToken({
                    id_akun : res[0].id_akun,
                    username : res[0].username,
                    nama : res[0].nama,
                    status : res[0].status,
                    kelengkapan : res[0].kelengkapan,
                    daftar_tunggu : res[0].daftar_tunggu
                });
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: true, token: token, status: 'You are successfully logged in!'});
            }
        )
}

exports.kirimEmail = (req,res,next)=>{
    mailer.customEmail(req.params.email, req.body.subject, req.body.isi)
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true});
}