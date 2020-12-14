const connection = require('../connection');
exports.create = async (req, res)=>{
    connection.query(
        `INSERT INTO barang (namaBarang, kategori, subkategori, harga) value (?,?,?,?)`,
        [req.body.namaBarang, req.body.kategori, req.body.subkategori, req.body.harga],
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
        `SELECT * from barang 
        left join (select * from barang_gambar group by idBarang) as gambar on gambar.idBarang = barang.idBarang
        order by barang.idBarang desc`,
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
        'update barang set ? where id_user =?',
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
        `select * from barang 
            left join barang_stock on barang_stock.idBarang = barang.idBarang
            where barang.idBarang =?
            order by warna, ukuran`,
        [req.params.idBarang],
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
exports.deleteById = (req, res)=>{
    connection.query(
        'delete from barang where idBarang=?',
        [req.params.idBarang],
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
exports.getByKategori = (req,res)=>{
    connection.query(
        `SELECT * FROM barang 
            left join (select * from barang_gambar group by idBarang) as gambar on gambar.idBarang = barang.idBarang
            where kategori=?`,
        [req.params.kategori],
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
exports.getBySubKategori = (req,res)=>{
    connection.query(
        `SELECT * FROM barang 
            left join (select * from barang_gambar group by idBarang) as gambar on gambar.idBarang = barang.idBarang
            where kategori=? and subkategori=?`,
        [req.params.kategori, req.params.subkategori],
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
exports.getSubKategori = (req,res)=>{
    connection.query(
        'SELECT distinct(subkategori) FROM barang where kategori=?',
        [req.params.kategori],
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
exports.insertGambar = (req,res)=>{
    connection.query(
        `insert into barang_gambar value(0,?,?)`,
        [req.params.idBarang, req.body.gambar],
        (error,result)=>{
            if(error){
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({success:false, message:'Terjadi kesalahan'});
            }else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success:true});
            }
        }
    )
}
exports.getGambarByIdBarang = (req,res)=>{
    connection.query(
        'select * from barang_gambar where idBarang=?',
        [req.params.idBarang],
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
exports.deleteGambarById = (req,res)=>{
    connection.query(
        'delete from barang_gambar where idBarangGambar=?',
        [req.params.idBarangGambar],
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