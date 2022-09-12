const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
    const RumahModel = sequelize.define("rumah", {
        idrumah: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        kode_rumah: {
            type: Sequelize.STRING,
            unique: true
        },
        keterangan: {
            type: Sequelize.STRING
        },
        jenis_bangunan: {
            type: Sequelize.ENUM("Rumah", "Kontrakan", "Kosan")
        },
        aktif: {
            type: Sequelize.INTEGER
        }
    });
    return RumahModel;
};