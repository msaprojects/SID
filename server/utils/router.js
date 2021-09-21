require('dotenv').config()
const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()
global.refreshTokens = []

//Login
var RouteToLoginController = require('../controller/login.controller')
router.post('/login', function(req, res){
    RouteToLoginController.Login(req, res)
})
router.post('/newtoken', function(req, res){
    RouteToLoginController.GenerateNewToken(req, res)
})

// Bulan
var RouteToBulanController = require('../controller/bulan.controller')
router.get('/bulan', function(req, res){
    RouteToBulanController.getAllBulan(req, res)
})
router.get('/bulan/:tahun', function(req, res){
    RouteToBulanController.getDataBulanByTahun(req, res)
})
router.post('/bulan', function(req, res){
    RouteToBulanController.addBulan(req, res)
})
router.put('/bulan/:idbulan', function(req, res){
    RouteToBulanController.ubahBulan(req, res)
})

//Pengguna
var RouteToPenggunaController = require('../controller/pengguna.controller')
router.get('/pengguna', function(req, res){
    RouteToPenggunaController.getAllPengguna(req, res)
})
router.post('/pengguna', function(req, res){
    RouteToPenggunaController.addPengguna(req, res)
})
router.put('/pengguna', function(req, res){
    RouteToPenggunaController.ubahPengguna(req, res)
})

// Rumah
var RouteToRumahController = require('../controller/rumah.controller')
router.get('/rumah', function(req, res){
    RouteToRumahController.getAllRumah(req, res)
})
router.get('/rumah/:barcode_gen', function(req, res){
    RouteToRumahController.getDetailRumah(req, res)
})
router.post('/rumah', function(req, res){
    RouteToRumahController.addRumah(req, res)
})
router.put('/rumah/:idnomor_rumah', function(req, res){
    RouteToRumahController.ubahRumah(req, res)
})

var RouteToTagihanController = require('../controller/tagihan.controller')
router.get('/tagihan', function(req, res){
    RouteToTagihanController.getSemuaTagihan(req, res)
})
router.post('/tagihan', function(req, res){
    RouteToTagihanController.addTagihan(req, res)
})
router.put('/tagihan/:idtagihan', function(req, res){
    RouteToTagihanController.ubahTagihan(req, res)
})
module.exports = router;