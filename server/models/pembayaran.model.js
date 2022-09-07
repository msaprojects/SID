const { sequelize, Sequelize, PembayaranModel } = require(".");

module.exports = (sequelize, Sequelize) => {
    const PembayaranModel = sequelize.define("pembayaran", {
        idpembayaran: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        kode_bayar: {
            type: Sequelize.STRING,
        },
        keterangan: {
            type: Sequelize.STRING,
        },
        idpengguna: {
            type: Sequelize.INTEGER
        },
        idtagihan: {
            type: Sequelize.INTEGER,
        },
    });
    return PembayaranModel;
};

