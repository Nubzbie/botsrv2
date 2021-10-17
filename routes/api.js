var fs = require('fs')
var express = require('express');
var moment = require('moment-timezone')
var Crypto = require('crypto')

var router = express.Router();

var current = process.cwd()

var Conn = require(current + '/lib/KritelSms')
var db = require(current + '/db/data.json')

const conn = new Conn()

/* GET home page. */
router.get('/sendInvoice', function(req, res, next) {
    var { no, kodeUnik, nama } = req.query

    var hosts = `${req.protocol}://${req.get('host')}` // ini gausah diganti, auto lookup nama host

    to = `${!no.startsWith('08') ? no.replace('628', '08') : no}`
    var idByte = Crypto.randomBytes(12).toString('hex').toUpperCase()

    var owner = '081253076020' // owner disini

    db.push({ no: to, hex: idByte, data: {...req.query}  })

    fs.writeFileSync(current + '/db/data.json', JSON.stringify(db, null, 2))

    let template = ` kode login kamu adalah ${kodeUnik}`

    conn.sendMessage(no, template)

    let linkKonfirmasi = `KONFIRMASI LOGIN [${nama}] MUSRAN: ${hosts}/api/v1/konfirmasiv2/${idByte}`

    setTimeout(() => {
        conn.sendMessage(owner, linkKonfirmasi)
    }, 2000)

    return res.status(200).json({
        status: 200,
        message: 'success',
        data: { ...req.query }
    })
});

router.get('/konfirmasiv2/:hex', function(req, res, next) {
    var { hex } = req.params

    var fetchUserHex = db.filter(v => v.hex == hex)
    if (fetchUserHex.length <= 0) return res.status(400).json({ status: 400, message: 'unavailable invoice id.' })

    var { no, hex: id, data } = fetchUserHex[0]

    db.splice(db.findIndex(v => v.hex == hex), 1)

    fs.writeFileSync(current + '/db/data.json', JSON.stringify(db, null, 2))

    let template = `Anda telah masuk di pemilihan musyran!`

    conn.sendMessage(no, template)
    return res.status(200).json({
        status: 200,
        message: 'login has confirmated by owner.',
        data: {...data}
    })
})

function randomBytes(length = 5) {
    return Crypto.randomBytes(length)
}


function  generateId(length) {
    return randomBytes(length).toString('hex').toUpperCase()
}

module.exports = router;
