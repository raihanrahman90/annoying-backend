const connection = require('../connection');
const authenticate = require('../authenticate');
const jwt = require('jsonwebtoken')
const mailer = require('./mailer')
const bcrypt = require('bcrypt')
const secretKey = "you motherfucker are not ready"
exports.create = async (req,res,next)=>{
    tanggal = Date.now()
    token = jwt.sign({username:req.body.username}, secretKey,{expiresIn: 3600})
    mailer.lupaPassword(req.body.username, token)
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.send({success:true})
}

exports.resetPassword = async (req, res, next)=>{
    password = await bcrypt.hash(req.body.password, 10)
    connection.query(
        `UPDATE tb_akun_baru set password=? where username = ?`,
        [password, req.username],
        (error, result2)=>{
            console.log(req.username)
            console.log(password)
            if(error){
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.send({success:false, message:error.message})
            }else{
                req.body.username = req.username
                next()
            }
        }
    )
}

exports.verifyToken = (req,res,next)=>{
    if (req.params.token == null) return res.sendStatus(401)
    jwt.verify(req.params.token, secretKey, (err,user)=>{
        if(err) {
            res.statusCode = 404
                res.setHeader('Content-Type', 'application/json')
                res.send({success:false, message:"Token tidak ditemukan atau masa aktif telah habis"})
        }else{

            req.username = user.username
            next()
        }
    })
}