const multer = require('multer');

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};
const proposalFileFilter = (req, file, cb)=>{
        if(!file.originalname.match(/\.(pdf)$/)) {
            return cb(new Error('You can upload only pdf files!'), false);
        }
    cb(null, true);
}

function setStorage(location, fileType){
    return multer.diskStorage({
        destination: (req,file,cb)=>{
            cb(null, 'public/'+location)
        },
        filename: (req,file, cb)=>{
            cb(null, Date.now()+fileType)
        }
    })
}
exports.uploadGambarBarang = (req, res, next)=>{
    var storage = setStorage("images/barang", ".jpeg")
    var upload = multer({ storage: storage, fileFilter: this.imageFileFilter}).fields([{name:'gambar'}]);
    upload(req, res, function (err) {
        if(req.files.gambar){
            req.body.gambar = req.files.gambar[0].filename
        }
        next()
    })
}

exports.uploadGambarBuktiPembayaran = (req, res, next)=>{
    var storage = setStorage("images/buktiPembayaran", ".jpeg")
    var upload = multer({ storage: storage, fileFilter: this.imageFileFilter}).fields([{name:'gambar'}]);
    upload(req, res, function (err) {
        if(req.files.gambar){
            req.body.bukti = req.files.gambar[0].filename
            req.body.status = 'Menunggu Konfirmasi'
        }
        next()
    })
}
exports.uploadStocking = (req, res, next)=>{
    var storage = setStorage("images/stocking", ".jpeg")
    var upload = multer({ storage: storage, fileFilter: this.imageFileFilter}).fields([{name:'gambar'}]);
    upload(req, res, function (err) {
        if(req.files.gambar){
            req.body.gambar = req.files.gambar[0].filename
        }
        next()
    })
}