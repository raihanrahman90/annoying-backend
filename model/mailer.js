const { NotExtended } = require('http-errors');
const nodemailer = require('nodemailer');
const { google } = require('googleapis')
const CLIENT_ID = '270735929960-rv3nuilqm47d2tl9tmvhk7boqt44qolh.apps.googleusercontent.com'
const CLIENT_SECRET = 'JvU9BGma3-52b3e9KpqigGTa'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04ocW5tsdjIpcCgYIARAAGAQSNwF-L9IraPr8Yjz3gcMO8ujUNegGaHumppC8m3_HFc-BPJsCo3yQhx4cCmJmg6gXz_ZxINPlqaw'
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN})
var smtpTransport = require('nodemailer-smtp-transport');
exports.main = async ()=>{
  const accessToken = await oAuth2Client.getAccessToken()
  return transporter = await nodemailer.createTransport({
    service:"gmail",
    auth:{
      type:"OAuth2",
      user:"raihanr090@gmail.com",
      clientId:CLIENT_ID,
      clientSecret:CLIENT_SECRET,
      refreshToken:REFRESH_TOKEN,
      accessToken:accessToken
    }
  })
}

exports.register = async (nama, username, token)=>{
    let transporter = await this.main();
    let info = await transporter.sendMail({
        from: "Yoi Akuakultur <noreply@yoiakuakultur.com>", // sender address
        to: username, // list of receivers
        subject: "Akun anda telah diverifikasi", // Subject line
        text: "Aktivasi Akun Anda",
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <title>Aktivasi Akun Yoi Akuakultur</title>
          <style>
            #logo{
                width:300px;
                height:auto;
            }
            .col-100{
                width:100%;
            }
            .banner{
                background:#0abde3;
                height:auto;
                padding-top:20px;
                padding-bottom:20px;
                padding-left:20px;
            }
            .btn{
                text-decoration:none;
                font-size:15px;
                width:200px;
                text-align:center;
                padding-top:5px;
                padding-bottom:5px;
                display:block;
            }
            .outline{
                color:#0abde3;
                border-color:#0abde3;
                border-style:solid;
                border-width:2px;
                border-radius: 25px;
            }
            .outline:hover{
                background:#0abde3;
                color:white;
            }
            .center{
                text-align:center;
            }
            .justify{
                text-align:justify;
            }
            .item-center{
                
            margin-left:auto;
            margin-right:auto;
            }
            #main{
                margin-top:50px;
                margin-left:50px;
                margin-right:50px;
            }
          </style>
        </head>
        <body>
        <div class="col-100 banner">
            <img id="logo" src="https://yoiakuakultur.com/assets/logo.png">
        </div>
        <div style="font-family: Arial, Helvetica, sans-serif;">
          <div class="justify" id="main">
            Halo `+nama+`<br>
            Terima kasih telah bergabung dengan Yoi Akuakultur Indonesia<br>
            
            Tinggal selangkah lagi sebelum Anda dapat memulai menjadi jurangan proyek budidaya perikanan yang berdampak bersama kami, silahkan verifikasi email Anda dengan mengklik link di bawah
            <br>
            <a class="btn outline item-center" href="https://yoiakuakultur.com/aktivasi/`+token+`">Klik Disini</a>
          </div>
        </div>
        </body>
        </html>`, // html body
      });
      transporter.sendMail(info, (err,res)=>{
        if(err){
          console.log(username)
        };
      })
}


exports.konfirmasiPembayaran = async (nama, username, namaProyek)=>{
  let transporter = await this.main();
  let info = await transporter.sendMail({
      from: "Yoi Akuakultur <noreply@yoiakuakultur.com>", // sender address
      to: username, // list of receivers
      subject: "Pembayaran Anda telah dikonfirmasi", // Subject line
      text: "Pembayaran", // plain text body
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>Pembayaran telah dikonfirmasi</title>
        <style>
          #logo{
              width:300px;
              height:auto;
          }
          .col-100{
              width:100%;
          }
          .banner{
              background:#0abde3;
              height:auto;
              padding-top:20px;
              padding-bottom:20px;
              padding-left:20px;
          }
          .btn{
              text-decoration:none;
              font-size:15px;
              width:200px;
              text-align:center;
              padding-top:5px;
              padding-bottom:5px;
              display:block;
          }
          .outline{
              color:#0abde3;
              border-color:#0abde3;
              border-style:solid;
              border-width:2px;
              border-radius: 25px;
          }
          .outline:hover{
              background:#0abde3;
              color:white;
          }
          .center{
              text-align:center;
          }
          .justify{
              text-align:justify;
          }
          .item-center{
              
          margin-left:auto;
          margin-right:auto;
          }
          #main{
              margin-top:50px;
              margin-left:50px;
              margin-right:50px;
          }
        </style>
      </head>
      <body>
      <div class="col-100 banner">
          <img id="logo" src="https://yoiakuakultur.com/assets/logo.png">
      </div>
      <div style="font-family: Arial, Helvetica, sans-serif;">
        <div class="justify" id="main">
          Halo `+nama+`<br>
          
          Selamat, Pembayaran Anda pada proyek `+namaProyek+` telah kami konfirmasi.<br/>
          Silahkan kunjungi website YOI AKUAKULTUR pada dashboard Anda untuk melakukan pemantauan.
          <br>
          
          <a class="btn outline item-center" href="https://yoiakuakultur.com/dashboard/portofolio">Menuju Dashboard</a>
        </div>
      </div>
      </body>
      </html>`, // html body
    });
    transporter.sendMail(info, (err,res)=>{
      if(err){
        console.log(username)
      };
    })
}


exports.customEmail = async (username, subject, isi)=>{
  let transporter = await this.main();
  let info = await transporter.sendMail({
      from: "Yoi Akuakultur <noreply@yoiakuakultur.com>", // sender address
      to: username, // list of receivers
      subject: subject, // Subject line
      text: subject, // plain text body
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>Pembayaran telah dikonfirmasi</title>
        <style>
          #logo{
              width:300px;
              height:auto;
          }
          .col-100{
              width:100%;
          }
          .banner{
              background:#0abde3;
              height:auto;
              padding-top:20px;
              padding-bottom:20px;
              padding-left:20px;
          }
          .btn{
              text-decoration:none;
              font-size:15px;
              width:200px;
              text-align:center;
              padding-top:5px;
              padding-bottom:5px;
              display:block;
          }
          .outline{
              color:#0abde3;
              border-color:#0abde3;
              border-style:solid;
              border-width:2px;
              border-radius: 25px;
          }
          .outline:hover{
              background:#0abde3;
              color:white;
          }
          .center{
              text-align:center;
          }
          .justify{
              text-align:justify;
          }
          .item-center{
              
          margin-left:auto;
          margin-right:auto;
          }
          #main{
              margin-top:50px;
              margin-left:50px;
              margin-right:50px;
          }
        </style>
      </head>
      <body>
      <div class="col-100 banner">
          <img id="logo" src="https://yoiakuakultur.com/assets/logo.png">
      </div>
      <div style="font-family: Arial, Helvetica, sans-serif;">
        <div class="justify" id="main">
          `+isi+`
        </div>
      </div>
      </body>
      </html>`, // html body
    });
    transporter.sendMail(info, (err,res)=>{
      if(err){
        console.log(err)
      };
    })
}

exports.pengingat = async (username, nama, id_roi, namaProyek)=>{
  let transporter = await this.main();
  let info = await transporter.sendMail({
      from: "Yoi Akuakultur <noreply@yoiakuakultur.com>", // sender address
      to: username, // list of receivers
      subject: "Segera Upload Bukti Pembayaran", // Subject line
      text: "Segeta Upload Bukti Pembayaran", // plain text body
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>Pembayaran telah dikonfirmasi</title>
        <style>
          #logo{
              width:300px;
              height:auto;
          }
          .col-100{
              width:100%;
          }
          .banner{
              background:#0abde3;
              height:auto;
              padding-top:20px;
              padding-bottom:20px;
              padding-left:20px;
          }
          .btn{
              text-decoration:none;
              font-size:15px;
              width:200px;
              text-align:center;
              padding-top:5px;
              padding-bottom:5px;
              display:block;
          }
          .outline{
              color:#0abde3;
              border-color:#0abde3;
              border-style:solid;
              border-width:2px;
              border-radius: 25px;
          }
          .outline:hover{
              background:#0abde3;
              color:white;
          }
          .center{
              text-align:center;
          }
          .justify{
              text-align:justify;
          }
          .item-center{
              
          margin-left:auto;
          margin-right:auto;
          }
          #main{
              margin-top:50px;
              margin-left:50px;
              margin-right:50px;
          }
        </style>
      </head>
      <body>
      <div class="col-100 banner">
          <img id="logo" src="https://yoiakuakultur.com/assets/logo.png">
      </div>
      <div style="font-family: Arial, Helvetica, sans-serif;">
        <div class="justify" id="main">
          Halo `+nama+`<br>
          
          Segera lakukan pembayaran pada `+namaProyek+`
          jika sudah melakukan pembayaran kirim bukti ke link berikut 
          <br>
          <a class="btn outline item-center href="https://yoiakuakultur.com/dashboard/pembayaran-detail/`+id_roi+`>Kirim Bukti</a>
          <br>
          </div>
      </div>
      </body>
      </html>`, // html body
    });
    transporter.sendMail(info, (err,res)=>{
      if(err){
        console.log(err)
      };
    })
}


exports.lupaPassword = async (username, nama, id_roi, namaProyek)=>{
  let transporter = await this.main();
  let info = await transporter.sendMail({
      from: "Yoi Akuakultur <noreply@yoiakuakultur.com>", // sender address
      to: username, // list of receivers
      subject: "Permintaan Reset Password", // Subject line
      text: "Permintaan Reset Password", // plain text body
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>Pembayaran telah dikonfirmasi</title>
        <style>
          #logo{
              width:300px;
              height:auto;
          }
          .col-100{
              width:100%;
          }
          .banner{
              background:#0abde3;
              height:auto;
              padding-top:20px;
              padding-bottom:20px;
              padding-left:20px;
          }
          .btn{
              text-decoration:none;
              font-size:15px;
              width:200px;
              text-align:center;
              padding-top:5px;
              padding-bottom:5px;
              display:block;
          }
          .outline{
              color:#0abde3;
              border-color:#0abde3;
              border-style:solid;
              border-width:2px;
              border-radius: 25px;
          }
          .outline:hover{
              background:#0abde3;
              color:white;
          }
          .center{
              text-align:center;
          }
          .justify{
              text-align:justify;
          }
          .item-center{
              
          margin-left:auto;
          margin-right:auto;
          }
          #main{
              margin-top:50px;
              margin-left:50px;
              margin-right:50px;
          }
        </style>
      </head>
      <body>
      <div class="col-100 banner">
          <img id="logo" src="https://yoiakuakultur.com/assets/logo.png">
      </div>
      <div style="font-family: Arial, Helvetica, sans-serif;">
        <div class="justify" id="main">
          Berikut ini adalah link pergantian password Anda, link perubahan password akan dinonaktifkan setelah 1 jam
          <a class="btn outline item-center" href="https://yoiakuakultur.com/ubah-password/`+token+`">Ganti Password</a>
          jika Anda tidak merasa melakukan permintaan pergantian password segera hubungi yoiakuakultur@gmail.com
          <br>
          <br>
          </div>
      </div>
      </body>
      </html>`, // html body
    });
    transporter.sendMail(info, (err,res)=>{
      if(err){
        console.log(err)
      };
    })
}