const loadModel = require('../models');
const PembayaranModel = loadModel.PembayaranModel;
const Op = loadModel.Sequelize.Op;
const GenerateNomerTransaksi = require('../utils/golobal.variable');

/**
 * @swagger
 * tags:
 *  name: Setting Iuran
 *  description: service for connecting to table rumah
 */

exports.findAll = (req, res) => {
    const { kode_bayar } = req.query;
    var filter = kode_bayar ? { kode_bayar: { [Op.like]: `%${kode_bayar}%` } } : null;
    PembayaranModel.findAll({
        where: filter
    }).then((result) => {
        res.status(200).send({
            message: `Ada ${result.length} data.`,
            data: result
        });
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data customer",
            data: null
        });
    });
};

exports.findOne = (req, res) => {
    const { idpembayaran } = req.params;
    PembayaranModel.findByPk(idpembayaran).then((result) => {
        if (result) {
            res.status(200).send({
                message: `Data ditemukan!`,
                data: result
            });
        } else {
            res.status(204).send({
                message: `Data tidak ditemukan!`,
                data: null
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data customer",
            data: null
        });
    });
};

exports.createData = (req, res) => {
    const { keterangan, idpengguna, idtagihan } = req.body;
    PembayaranModel.create({
        kode_bayar: `NBY-${Date().toLocalDateString('id-ID')}-${GenerateNomerTransaksi.NumberTransaction}`,
        keterangan,
        idpengguna: req.decode.idpengguna,
        idtagihan
    }).then((result) => {
        res.status(201).send({
            message: 'Data berhasil ditambahkan!',
            result
        });
    }).catch((err) => {
        res.status(500).send({
            message: 'Data gagal ditambahkan!',
            err
        });
    });
};

exports.updateData = (req, res) => {
    const { idpembayaran } = req.params;
    const { keterangan, idpengguna, idtagihan } = req.body;
    SettingIuranModel.findByPk(idpembayaran).then(function (data) {
        data.update({
            keterangan,
            idpengguna: req.decode.idpengguna,
            idtagihan
        }).then((result) => {
            res.status(200).send({
                message: 'Data berhasil diubah!',
                result
            });
        }).catch((err) => {
            res.status(500).send({
                message: 'Data gagal diubah!',
                err
            });
        });
    });
};

exports.deleteData = (req, res) => {
    const { idpembayaran } = req.params;
    PembayaranModel.findByPk(idpembayaran).then(function (data) {
        data.destroy();
    }).then((result) => {
        res.status(200).send({
            message: 'Data berhasil dihapus!',
            data: null
        });
    }).catch((err) => {
        res.status(500).send({
            message: 'Data gagal dihapus!',
            err
        });
    });
};