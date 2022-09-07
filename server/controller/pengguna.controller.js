const loadModel = require('../models')
const PenggunaModel = loadModel.PenggunaModel
const Op = loadModel.Sequelize.Op
const bcrypt = require('bcrypt')
/**
 * @swagger
 * tags:
 *  name: Pengguna
 *  description: service for connection to table pengguna
 */

exports.findAll = (req, res) => {
    const nama = req.query.nama
    var filter = nama ? { nama: { [Op.nama]: `%${nama}%` } } : null
    PenggunaModel.findAll({
        attributes:{
            exclude: ['password']
        },
        where: filter
    }).then((result) => {
        res.status(200).send({
            message: `Ada ${result.length} data`,
            data: result
        })
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data customer",
            data: null
        })
    });
}

exports.findOne = (req, res) => {
    const idpengguna = req.params.idpengguna
    PenggunaModel.findByPk(idpengguna).then((result) => {
        if (result) {
            res.status(200).send({
                message: `Data ditemukan!`,
                data: result
            })
        } else {
            res.status(204).send({
                message: `Data tidak ditemukan!`,
                data: null
            })
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data customer",
            data: null
        })
    });
}

exports.createData = (req, res) => {
    const { nama, password, jabatan, aktif, idrumah } = req.body
    PenggunaModel.create({
        nama,
        password: bcrypt.hashSync(password, 8),
        jabatan,
        aktif,
        idrumah
    }).then((result) => {
        res.status(201).send({
            message: 'Data berhasil ditambahkan!',
            result
        })
    }).catch((err) => {
        res.status(500).send({
            message: 'Data gagal ditambahkan!',
            err
        })
    })
}

exports.updateData = (req, res) => {
    const { idpengguna } = req.params
    const { nama, password, jabatan, aktif, idrumah } = req.body
    PenggunaModel.findByPk(idpengguna).then(function (data) {
        data.update({
            nama,
            password: bcrypt.hashSync(password, 8),
            jabatan,
            aktif,
            idrumah
        }).then((result) => {
            res.status(200).send({
                message: 'Data berhasil ditambahkan!',
                result
            })
        }).catch((err) => {
            res.status(500).send({
                message: 'Data gagal ditambahkan!',
                err
            })
        })
    })
}

exports.deleteData = (req, res) => {
    const { idpengguna } = req.params
    PenggunaModel.findByPk(idpengguna).then(function (data) {
        data.destroy()
    }).then((result) => {
        res.status(200).send({
            message: 'Data berhasil dihapus!',
            data: null
        })
    }).catch((err) => {
        res.status(500).send({
            message: 'Data gagal dihapus!',
            err
        })
    })
}