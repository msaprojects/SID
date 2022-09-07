const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
    const PenggunaModel = sequelize.define("pengguna", {
        idpengguna: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nama: {
            type: Sequelize.STRING,
            unique: true
        },
        password: {
            type: Sequelize.STRING
        },
        jabatan: {
            type: Sequelize.ENUM("Admin", "Warga")
        },
        aktif: {
            type: Sequelize.INTEGER,
        },
        idrumah: {
            type: Sequelize.INTEGER,
        }
    });
    return PenggunaModel;
};