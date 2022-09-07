const loadModel = require('../models')
const TagihanModel = loadModel.TagihanModel
const Op = loadModel.Sequelize.Op
const GenerateNomerTransaksi = require('../utils/golobal.variable')

/**
 * @swagger
 * tags:
 *  name: Tagihan
 *  description: service for connecting to table rumah
 */

exports.findAll = (req, res) => {
    const { nomor_tagihan } = req.query
    var filter = nomor_tagihan ? { nomor_tagihan: { [Op.like]: `%${nomor_tagihan}%` } } : null
    TagihanModel.findAll({
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
    const { idtagihan } = req.params
    TagihanModel.findByPk(idtagihan).then((result) => {
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
    const { idsetting_iuran, idrumah, idpengguna } = req.body
    TagihanModel.create({
        nomor_tagihan: `NTG-${Date().toLocalDateString('id-ID')}-${GenerateNomerTransaksi.NumberTransaction}`,
        idsetting_iuran,
        idrumah,
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

exports.deleteData = (req, res) => {
    const { idtagihan } = req.params
    TagihanModels.findByPk(idtagihan).then(function (data) {
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