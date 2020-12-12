const connection = require('../connection');
exports.create = async (req, res)=>{
    connection.query(
        `INSERT INTO cart value (0,?,?,null,?)`,
        [req.user.idUser, req.body.idBarangStock, req.body.jumlah],
        (error,result)=>{
            console.log(req.body)
            if(error){
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.send({success:false, message:error.message});
            }else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success:true, id:result.insertId});
            }
        }
    )
}

exports.getAll = (req, res)=>{
    connection.query(
        `SELECT * from cart`,
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
    connection.query(
        'update cart set ? where id_user =?',
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
                    res.json({message: "Barang tidak ditemukan"});
                }
            }
        }
    )
}

exports.getById = (req,res)=>{
    connection.query(
        `select * from cart 
            left join barang_stock on barang_stock.idBarang = cart.idCart
            where cart.idCart =?
            order by idBarangStock, jumlah`,
        [req.params.idCart],
        (error,result)=>{
            if(error){
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({message: error.message});
            }else{
                hasil = {
                    namaBarang:result[0].namaBarang,
                    harga:result[0].harga,
                    gambar:req.body.gambar,
                    warna:{}
                }
                for(let stock in result){
                    let barang = result[stock]
                    if(!hasil.warna[barang.warna]){
                        hasil.warna[barang.warna]={}
                    }
                    hasil.warna[barang.warna][barang.ukuran]=barang.stock
                }
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json');
                res.json({success:true, result:hasil})
            }
        }
    )
}