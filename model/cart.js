const connection = require('../connection');
exports.create = async (req, res)=>{
    connection.query(
        `INSERT INTO cart value (0,?,?,null,?)`,
        [req.user.idUser, req.body.idBarangStock, req.body.jumlah],
        (error,result)=>{
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
        'update cart set ? where idCart =?',
        [req.body, req.params.idCart],
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

exports.getByIdUser = (req,res)=>{
    connection.query(
        `select * from cart 
            left join barang_stock on barang_stock.idBarangStock = cart.idBarangStock
            left join barang on barang.idBarang = barang_stock.idBarang
            where cart.idUser =?` ,
        [req.user.idUser],
        (error,result)=>{
            if(error){
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({message: error.message});
            }else{
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json');
                res.json({success:true, result})
            }
        }
    )
}

exports.getByIdUserCheckoutNull = (req,res)=>{
    connection.query(
        `select * from cart 
            left join barang_stock on barang_stock.idBarangStock = cart.idBarangStock
            left join barang on barang.idBarang = barang_stock.idBarang
            where cart.idUser =? and cart.idCheckout is null` ,
        [req.user.idUser],
        (error,result)=>{
            if(error){
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({message: error.message});
            }else{
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json');
                res.json({success:true, result})
            }
        }
    )
}

exports.deleteById = (req, res)=>{
    connection.query(
        'delete from cart where idCart =?',
        [req.params.idCart],
        (error,result)=>{
            if(error){
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json');
                console.log(error.message)
                res.json({success:false, message:'Terjadi kesalahan'})
            }else{
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json');
                res.json({success:true})
            }
        }
    )
}





