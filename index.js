const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const jwt = require('jsonwebtoken')

//membuat aplikasi framework express
const app = express()
const port = 8000

//inisialisasi secret key yang digunakan oleh jwt
const secretKey = 'thisisverysecretKey'

//enable body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))

//koneksi ke database
const conn = mysql.createConnection({
    host : 'localhost',
    user: 'root',
    password : ''
    database : 'latihan_ukl'
})

conn.connect((err) => {
    if (err) throw err
    console.log('Connected...')
})

//login penjual
const isAuthorized = (req, res, next) => {
    if (typeof(req.headers['x-api-key'] == 'undefined'))
    {
        return res.status(403).json({
            success : false,
            message : 'Unauthorized. Token is not provided'
        })
    }

    let token = req.headers['x-api-key']

    jwt.verify(token, secretKey, (err, decoded) => {
        if(err)
        {
            return res.status(403).json ({
                success : false,
                message : 'Unauthorized. Token is not provided'
            })
        }
    })

    next()
}

//CRUD Penjual//

//endpoint get data pembeli
app.get('/pembeli', (req, res) => {
    let sql =`
    select nama_pembeli, alamat, kontak, created_at from pembeli
    `

    db.query(sql, (err, result) => {
        if (err) throw err
        res.json ({
            message : "Sukses mendapatkan semua data",
            data : result 
        })
    })
})

app.post('/pembeli', (res, res) => {
    let data = req.body

    let sql = `
    insert into pembeli (nama_pembeli, alamat, kontak)
    values ('`+data.nama_pembeli+`', '`+data.alamat+`', '`+data.kontak+`')
    `

    db.query(sql, (err, result) => {
        if (err) throw err
        res.json ({
            message : "Data berhasil ditambahkan",
            data : result 
        })
    })
})

app.get('/pembeli/:id_pembeli', (req, res) => {
    let sql = `
    select * from pembeli
    where id_pembeli = `+req.params.id_pembeli+`
    limit 1
    `

    db.query(sql, (err, result) => {
        if (err) throw err 
        res.json ({
            message : "Sukses mendapatkan data berdasarkan id",
            data : result[0]
        })
    })
})

app.put('/pembeli/:id', (req, res) => {
    let data = req.body

    let sql = `
    update pembeli
    set nama_pelanggan = '`+data.nama_pembeli+`', alamat = '`+data.alamat+`', kontak = '`+data.kontak+`'
    where id_pembeli = '`+req.params.id_pembeli`'
    `

    db.query (sql, (err, result) => {
        if (err) throw err
        res.json ({
            message : "Data berhasil diubah",
            data: result 
        })
    })
})

app.delete('/pembeli/:id', (req.res) => {
    let sql = `
    delete from pembeli
    where id_pembeli = `'+req.params.id_pembeli+'`
    `

    db.query(sql, (err, result) => {
        if (err) throw err 
        res.json ({
            message : "Data berhasil dihapus",
            data : result
        })
    })
})