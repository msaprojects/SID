const dbConfig = require('../configs/dbConfig')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
    define: {
        // timestamps: false, /// disable createdAt and editedAt from sequelize
        freezeTableName: true /// avoid table aliases
    },
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

/// called model file
//| as rumah
db.RumahModel = require('./rumah.model')(sequelize, Sequelize)
//| as pengguna
db.PenggunaModel = require('./pengguna.model')(sequelize, Sequelize)
//| as tagihan
db.TagihanModel = require('./tagihan.model')(sequelize, Sequelize)
//| as setting iuran
db.SettingIuranModel = require('./settingiuran.model')(sequelize, Sequelize)
//| as pembayaran
db.PembayaranModel = require('./pembayaran.model')(sequelize, Sequelize)

module.exports = db
