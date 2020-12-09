var express = require('express');
var router = express.Router();
var Admin = require('../model/admin')
var Barang = require('../model/barang')
var Upload = require('../model/upload_file')
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


router.route('/barang/')
.get(multer().none(), Barang.getAll)
.post(multer().none(),  authenticate.verifyAdmin, Barang.create)

router.route('/barang/:idBarang')
.post(multer().none(), authenticate.verifyAdmin, Barang.updateById)
.get(multer().none(), Barang.getById)
.delete(multer().none(), authenticate.verifyAdmin, Barang.deleteById)



module.exports = router