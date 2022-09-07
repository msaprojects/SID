const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
    const TagihanModel = sequelize.define("tagihan", {
        idtagihan: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nomor_tagihan: {
            type: Sequelize.STRING,
        },
        idsetting_iuran: {
            type: Sequelize.INTEGER,
        },
        idrumah: {
            type: Sequelize.INTEGER
        },
        idpengguna: {
            type: Sequelize.INTEGER,
        },
    })
    return TagihanModel
}