var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var connection = require('./connection');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("my password", salt);
var secretKey = 'Slim Motherfucker Shady';

exports.getToken = function(user) {
    return jwt.sign(user, secretKey,
        {expiresIn: 3600});
};

exports.verifyUser = (req,res,next)=>{
    var authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, secretKey, (err,user)=>{
        if(err) {
            return res.sendStatus(403)
        }else{
            req.user = user
            next()
        }
    })
};
exports.verifyMyData = (req,res,next)=>{
    var authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, secretKey, (err,user)=>{
        if(err) {
            return res.sendStatus(403)
        }else{
            req.user = user
            if(req.user.idUser==req.params.idUser || req.user.idUser==req.body.idUser){
                next()
            }else{
                res.statusCode= 403
                res.setHeader('Content-Type', 'application/json');
                res.send({message:"Action can only be done by Admin"})
            }
        }
    })
}
exports.verifyAdmin = (req, res, next)=>{
    var authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, secretKey, (err,user)=>{
        if(err) {
            return res.sendStatus(403)
        }else{
            req.user = user
            if(req.user.hakAkses=="Super Admin" || req.user.hakAkses=='Admin'){
                next()
            }else{
                res.statusCode= 403
                res.setHeader('Content-Type', 'application/json');
                res.send({message:"Action can only be done by Admin"})
            }
        }
    })
};

exports.verifySeller = (req,res,next)=>{
    var authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, secretKey, (err,user)=>{
        if(err) {
            return res.sendStatus(403)
        }else{
            req.user = user
            if(req.user.hak_akses=="Super Admin" || req.user.hak_akses=='Admin' || req.user.hak_akses=='Seller'){
                next()
            }else{
                res.statusCode= 403
                res.setHeader('Content-Type', 'application/json');
                res.send({message:"Action can only be done by Admin and Seller"})
            }
        }
    })
}