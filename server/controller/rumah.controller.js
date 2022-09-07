const loadModel = require('../models')
const RumahModel = loadModel.RumahModel
const Op = loadModel.Sequelize.Op

/**
 * @swagger
 * tags:
 *  name: Rumah
 *  description: service for connecting to table rumah
 */

exports.findAll = (req, res) => {
    const kode_rumah = req.query.kode_rumah
    var filter = kode_rumah ? { kode_rumah: { [Op.like]: `%${kode_rumah}%` } } : null
    RumahModel.findAll({
        where: filter
    }).then((result) => {
        res.status(200).send({
            message: `Ada ${result.length} data.`,
            data: result
        })
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data customer",
            data: null
        })
    })
}

exports.findOne = (req, res) => {
    const idrumah = req.params.idrumah
    RumahModel.findByPk(idrumah).then((result) => {
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
    })
}

exports.createData = (req, res) => {
    const { kode_rumah, keterangan, jenis_bangunan, aktif } = req.body
    RumahModel.create({
        kode_rumah,
        keterangan,
        jenis_bangunan,
        aktif
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
    const { idrumah } = req.params
    const { kode_rumah, keterangan, jenis_bangunan, aktif } = req.body
    RumahModel.findByPk(idrumah).then(function (data) {
        data.update({
            kode_rumah,
            keterangan,
            jenis_bangunan,
            aktif
        }).then((result) => {
            res.status(200).send({
                message: 'Data berhasil diubah!',
                result
            })
        }).catch((err) => {
            res.status(500).send({
                message: 'Data gagal diubah!',
                err
            })
        });
    })
}

exports.deleteData = (req, res) => {
    const idrumah = req.params.idrumah
    RumahModel.findByPk(idrumah).then(function (data) {
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