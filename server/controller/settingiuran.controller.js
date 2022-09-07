const loadModel = require('../models')
const SettingIuranModel = loadModel.SettingIuranModel
const Op = loadModel.Sequelize.Op

/**
 * @swagger
 * tags:
 *  name: Setting Iuran
 *  description: service for connecting to table rumah
 */

exports.findAll = (req, res) => {
    SettingIuranModel.findAll({}).then((result) => {
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
    const { idsetting_iuran } = req.params
    SettingIuranModel.findByPk(idsetting_iuran).then((result) => {
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
    const { keterangan, nominal, aktif, tanggal_berlaku, idpengguna } = req.body
    SettingIuranModel.create({
        keterangan,
        nominal,
        aktif,
        tanggal_berlaku,
        idpengguna: req.decode.idpengguna
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
    const { idsetting_iuran } = req.params
    const { keterangan, nominal, aktif, tanggal_berlaku, idpengguna } = req.body
    SettingIuranModel.findByPk(idsetting_iuran).then(function (data) {
        data.update({
            keterangan,
            nominal,
            aktif,
            tanggal_berlaku,
            idpengguna: req.decode.idpengguna
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
    const { idsetting_iuran } = req.params
    SettingIuranModel.findByPk(idsetting_iuran).then(function (data) {
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