const connection = require('../connection');
exports.create = async (req, res)=>{
    connection.query(
        `INSERT INTO checkout value (0,?,null, ?,?,
                                     ?,?,?,?,
                                     ?,?,null,null,
                                     ?,?,'Menunggu Pembayaran',now(),null)`,
        [req.user.idUser, req.body.provinsi, req.body.kota, 
         req.body.kecamatan, req.body.kelurahan, req.body.alamat, req.body.atasNama, 
         req.body.noTelpon,req.body.kodeDiscount, 
         req.body.ongkosKirim, req.body.total],
        (error,result)=>{
            if(error){
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.send({success:false, message:error.message});
            }else{
                connection.query(
                    `UPDATE cart set idCheckout=? where idUser = ? and idCheckout is null`,
                    [result.insertId, req.user.idUser],
                    (error1, result1)=>{
                        if(error1){
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
        }
    )
}
exports.getAll = (req,res)=>{
    connection.query(
        `SELECT * FROM checkout
            left join user on user.idUser=checkout.idUser`,
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
    
    exports.getById = (req, res,next)=>{
        connection.query(
            `SELECT checkout.*, discount.discount, nilai, ulasan from checkout
                left join discount on discount.kodeDiscount = checkout.kodeDiscount
                left join ulasan on ulasan.idCheckout = checkout.idCheckout  
                where checkout.idCheckout = ?`,
            [req.params.idCheckout],
            (error, result)=>{
                if(error){
                    res.statusCode = 500
                    res.setHeader('Content-Type', 'application/json')
                    res.json({success:false, message:error.message})
                }else{
                    connection.query(
                        `SELECT cart.*, gambar_table.gambar,barang.namaBarang,barang_stock.warna, barang_stock.ukuran, barang.harga, barang.idBarang FROM cart
                        left join barang_stock on barang_stock.idBarangStock = cart.idBarangStock
                        left join barang on barang.idBarang = barang_stock.idBarang
                        left join (select gambar, idBarang from barang_gambar group by idBarang) as gambar_table on gambar_table.idBarang = barang.idBarang
                        where idCheckout=?`,
                        [req.params.idCheckout],
                        (error1, result1)=>{
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json')
                            res.json({...result[0],success:true, result:result1})
                        }
                    )
                }
            }
        )
    }
    
    exports.deleteById = (req, res, next)=>{
        connection.query(
            `DELETE FROM checkout where idCheckout=?`,
            [req.params.idCheckout],
            (error, result)=>{
                if(error){
                    res.statusCode = 500
                    res.setHeader('Content-Type', 'application/json')
                    res.json({success:false, message:"Terjadi kesalahan"})
                }else{
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json({success:true})
                }
            }
        )
    }
    exports.updateById = (req,res, next)=>{
        connection.query(
            `Update checkout set ? where idCheckout=?`,
            [req.body, req.params.idCheckout],
            (error, result)=>{
                if(error){
                    res.statusCode = 500
                    res.setHeader('Content-Type', 'application/json')
                    console.log(error.message)
                    res.json({success:false, message:"Terjadi kesalahan"})
                }else{
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json({success:true})
                }
            }
        )
    }
    
    exports.getByToken = (req, res,next)=>{
        connection.query(
            `SELECT idCheckout, total, bukti, resi, created_at,status FROM checkout
                left join user on user.idUser = checkout.idUser
                left join admin on admin.idAdmin = checkout.idAdmin
                where checkout.idUser = ?`,
            [req.user.idUser],
            (error, result)=>{
                if(error){
                    res.statusCode = 500
                    res.setHeader('Content-Type', 'application/json')
                    res.json({success:false, message:"Terjadi kesalahan"})
                }else{
                    var status = (data)=>{
                        if(!data.bukti){
                            return {...data, pemesanan:new Date(data.created_at+1).toLocaleDateString()}            
                        }else if(!data.resi){
                            return {...data, pemesanan:new Date(data.created_at+1).toLocaleDateString()}
                        }else{
                            return {...data, pemesanan:new Date(data.created_at+1).toLocaleDateString()}
                        }
                    }
                    var hasil = result.map(data=>status(data))
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json({success:true,result:hasil})
                }
            }
        )
    }
exports.konfirmasi = (req, res)=>{
    connection.query(
        `Update checkout set status='Terkonfirmasi', resi=? where idCheckout=?`,
        [req.body.resi, req.params.idCheckout],
        (error, result)=>{
            if(error){
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                console.log(error.message)
                res.json({success:false, message:"Terjadi kesalahan"})
            }else{
                console.log(req.body.resi)
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json({success:true})
            }
        }
    )
}
exports.getPembayaran = (req, res)=>{
    connection.query(
        `SELECT * FROM checkout order by FIELD(status, 'Menunggu Konfirmasi', 'Menunggu Pembayaran', 'Kadaluarsa')`,
        (error, result)=>{
            if(error){
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                console.log(error.message)
                res.json({success:false, message:"Terjadi kesalahan"})
            }else{
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json({success:true, result:result})
            }
        }
    )
}