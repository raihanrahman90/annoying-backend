var express = require('express');
var router = express.Router();
var Akun = require('../model/akun')
var Admin = require('../model/admin')
var Upload = require('../model/upload_file')
var MetodePembayaran = require('../model/metode_pembayaran')
var LupaPassword = require('../model/lupa_password');
var authenticate = require('../authenticate');
var multer = require('multer');
var bodyParser = require('body-parser')
const rateLimit = require("express-rate-limit");
const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 15 minutes
    max: 15,
    message: 'Request diblock selama 1 jam'
});
/* GET home page. */
router.use(bodyParser.json())

router.route('/admin/')
.get(multer().none(), Admin.getAll)
.post(multer().none(),  Admin.create)

router.route('/admin/login')
.post(multer().none(),    
    apiLimiter, 
    Admin.login)

router.route('/admin/:idAdmin')
.post(multer().none(), authenticate.verifyAdmin, Admin.updateById)
.get(multer().none(), Admin.getById)
.delete(multer().none(), authenticate.verifyAdmin, Admin.deleteById)

router.route('/akun/')
.get(multer().none(), authenticate.verifyAdmin,  Akun.getAllAkun)
router.route('/akun/login')
.post(multer().none(),
    apiLimiter, 
    Akun.login)
router.route('/akun/signup')
.post(multer().none(), Akun.create)
router.route('/akun/kirimEmailVerifikasi')
.post(multer().none(), authenticate.verifyUser, Akun.kirimEmail)
.get(multer().none(), authenticate.verifyUser, Akun.getMyData)
router.route('/akun/aktivasi')
.post(multer().none(), Akun.aktivasi, Akun.getNewToken)
router.route('/akun/lupaPassword')
.post(multer().none(), LupaPassword.create)
router.route('/akun/lupaPassword/:token')
.post(multer().none(), LupaPassword.verifyToken, LupaPassword.resetPassword, Akun.login)
router.route('/akun/:id_akun')
.get(multer().none(), authenticate.verifyAdmin, Akun.getById)
.post(multer().none(), authenticate.verifyAdmin, Akun.updateById)
.delete(multer().none(), authenticate.verifyAdmin, Akun.deleteById)

router.route('/metode_pembayaran/')
.post( authenticate.verifyAdmin, multer().none(), authenticate.verifyAdmin, MetodePembayaran.create)
.get( multer().none(), MetodePembayaran.getAll)

router.route('/metode_pembayaran/:id_metode_pembayaran')
.post(multer().none(), authenticate.verifyAdmin, MetodePembayaran.updateById)
.get(multer().none(), MetodePembayaran.getById)
.delete(multer().none(), authenticate.verifyAdmin, MetodePembayaran.deleteById)
module.exports = router