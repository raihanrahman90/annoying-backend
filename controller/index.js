var express = require('express');
var router = express.Router();
var Admin = require('../model/admin')
var User = require('../model/users')
var Barang = require('../model/barang')
var Upload = require('../model/upload_file')
var Stocking = require('../model/stocking')
var authenticate = require('../authenticate');
var multer = require('multer');
var bodyParser = require('body-parser')
var Cart = require('../model/cart')
var Discount = require('../model/discount')
var Ulasan = require('../model/ulasan')
var Checkout = require('../model/checkout')
const rateLimit = require("express-rate-limit");
const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 15 minutes
    max: 15,
    message: 'Request diblock selama 1 jam'
});
/* GET home page. */
router.use(bodyParser.json())

router.route('/admin/')
.get(multer().none(), authenticate.verifyAdmin, Admin.getAll)
.post(multer().none(),  authenticate.verifyAdmin, Admin.create)

router.route('/admin/login')
.post(multer().none(),    
    apiLimiter, 
    Admin.login)

router.route('/admin/:idAdmin')
.post(multer().none(), authenticate.verifyAdmin, Admin.updateById)
.get(multer().none(), authenticate.verifyAdmin, Admin.getById)
.delete(multer().none(), authenticate.verifyAdmin, Admin.deleteById)


router.route('/user/')
.get(multer().none(), authenticate.verifyAdmin, User.getAll)
.post(multer().none(),  User.create)

router.route('/user/login')
.post(multer().none(),    
    apiLimiter, 
    User.login)

router.route('/user/myData')
.get(multer().none(), authenticate.verifyUser, User.getMyData)
.post(multer().none(), authenticate.verifyUser, User.updateMyData, User.getNewToken)
router.route('/user/:idUser')
.post(multer().none(), authenticate.verifyAdmin, User.updateById)
.get(multer().none(), authenticate.verifyUser, User.getById)
.delete(multer().none(), authenticate.verifyAdmin, User.deleteById)


router.route('/barang/')
.get(multer().none(), Barang.getAll)
.post(multer().none(),  authenticate.verifyAdmin, Barang.create)

router.route('/kategori/:kategori')
.get(multer().none(), Barang.getByKategori)
router.route('/kategori/:kategori/subkategori')
.get(multer().none(), Barang.getSubKategori)

router.route('/kategori/:kategori/subkategori/:subkategori')
.get(multer().none(), Barang.getBySubKategori)
router.route('/barang/:idBarang')
.post(multer().none(), authenticate.verifyAdmin, Barang.updateById)
.get(multer().none(), Barang.getById)
.delete(multer().none(), authenticate.verifyAdmin, Barang.deleteById)

router.route('/barang/:idBarang/gambar')
.post(authenticate.verifyAdmin, Upload.uploadGambarBarang,Barang.insertGambar)
.get(multer().none(), Barang.getGambarByIdBarang)

router.route('/barang/:idBarang/gambar/:idBarangGambar')
.delete(authenticate.verifyAdmin, Barang.deleteGambarById)

router.route('/cart')
.post(multer().none(), authenticate.verifyUser, Cart.create)

router.route('/cart/myCart')
.get(multer().none(), authenticate.verifyUser, Cart.getByIdUser)
router.route('/cart/mycart/CheckoutNull')
.get(multer().none(), authenticate.verifyUser, Cart.getByIdUserCheckoutNull)
router.route('/cart/:idCart')
.post(multer().none(), authenticate.verifyUser, Cart.updateById)
.delete(authenticate.verifyUser, Cart.deleteById)

router.route('/stocking')
.post(multer().none(), authenticate.verifyAdmin, Stocking.create)
.get(authenticate.verifyAdmin, Stocking.getAll)

router.route('/discount')
.post(multer().none(), authenticate.verifyAdmin, Discount.create)
.get(authenticate.verifyAdmin, Discount.getAll)

router.route('/discount/:idDiscount')
.post(multer().none(), authenticate.verifyAdmin, Discount.updateById)
.get(Discount.getById)
.delete(Discount.deleteById)

router.route('/kodeDiscount/:kodeDiscount')
.get(Discount.checkKodeDiscount)

router.route('/ulasan')
.post(multer().none(), authenticate.verifyUser,Ulasan.create )
.get(Ulasan.getAll)

router.route('/ulasan/:idUlasan')
.post(multer().none(), authenticate.verifyUser, Ulasan.updateById)
.get(multer().none(), Ulasan.getById)
.delete(multer().none(), authenticate.verifyUser, Ulasan.deleteById)

router.route('/checkout')
.post(multer().none(), authenticate.verifyUser, Checkout.create)
.get(multer().none(), authenticate.verifyAdmin, Checkout.getAll)

router.route('/checkout/getMyCheckout')
.get(authenticate.verifyUser, Checkout.getByToken)


router.route('/checkout/:idCheckout')
.post(authenticate.verifyUser, Checkout.updateById)
.get(authenticate.verifyUser, Checkout.getById)
.delete(authenticate.verifyUser, Checkout.deleteById)

router.route('/checkout/:idCheckout/bukti')
.post(authenticate.verifyUser, Upload.uploadGambarBuktiPembayaran, Checkout.updateById)

router.route('/pembayaran')
.get(authenticate.verifyAdmin, Checkout.getPembayaran)

router.route('/pembayaran/:idCheckout')
.post(multer().none(), authenticate.verifyAdmin, Checkout.konfirmasi)

module.exports = router