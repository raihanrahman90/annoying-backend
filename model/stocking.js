const connection = require('../connection');
var insert = (idStocking, idBarang, warna, ukuran,stock)=>{
    connection.query(
        "INSERT INTO detail_stocking value(0,?,?,?,?,?)",
        [idStocking, idBarang, warna, ukuran, stock],
        (error,result)=>{
            if(error){
                console.log(error)
            }
        }
    );
}
var update = (idBarang, warna, ukuran, stock)=>{
    connection.query(
        "SELECT idBarangStock, stock FROM barang_stock where warna=? and ukuran=? and idBarang=?",
        [warna, ukuran, idBarang],
        (error, result)=>{
            if(error){
                console.log(error)
            }else if(result[0]){
                connection.query('UPDATE barang_stock set stock=?, updated_at=now() where idBarangStock=?',
                    [stock+result[0].stock, result[0].idBarangStock]
                )
            }else{
                connection.query('INSERT INTO barang_stock value(0,?,?,?,?,now(),now())',
                    [idBarang, ukuran, warna,stock]
                )
            }
        }
    )
}
exports.create = async (req, res)=>{
    connection.query(
        `INSERT INTO stocking value (0, now(), now(), ?)`,
        [req.user.idAdmin],
        (error,result)=>{
            if(error){
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.send({success:false, message:error.message});
            }else{
                var data;
                for(let i in req.body.detailStocking){
                    data = req.body.detailStocking[i]
                    insert(result.insertId, data.idBarang, data.warna, data.ukuran, data.stock)
                    update(data.idBarang, data.warna, data.ukuran, data.stock)
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success:true, id:result.insertId});
            }
        }
    )
}
exports.getAll = (req,res)=>{
    connection.query(
        "SELECT * FROM stocking order by created_at desc",
        (error,result)=>{
            if(error){
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.send({success:false, message:error.message});
            }else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success:true, result:result});
            }
        }
    )
}