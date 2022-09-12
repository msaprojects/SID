const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
    const SettingIuranModel = sequelize.define("setting_iuran", {
        idsetting_iuran: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        keterangan: {
            type: Sequelize.STRING,
        },
        nominal: {
            type: Sequelize.FLOAT,
        },
        aktif: {
            type: Sequelize.INTEGER
        },
        tanggal_berlaku: {
            type: Sequelize.DATEONLY,
            unique: true
        },
        idpengguna: {
            type: Sequelize.INTEGER,
        }
    });
    return SettingIuranModel;
};