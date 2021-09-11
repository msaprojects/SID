require('dotenv').config()
const jwt = require('jsonwebtoken')
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    timezone: 'utc-8'
})

/**
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *  schemas:
 *      bulan:
 *          type: object
 *          required:
 *              - nama_bulan
 *              - tahun
 *              - keterangan
 *              - aktif
 *          properties:
 *              idbulan:
 *                  type: int
 *                  description: auto increment
 *              nama_bulan: 
 *                  type: string
 *                  description: kode rumah
 *              tahun:
 *                  type: string
 *                  description: keterangan rumah
 *              keterangan:
 *                  type: string
 *                  description: jenis rumah kosan atau rumah permanen
 *              idpengguna:
 *                  type: int
 *                  description: untuk mencatat idpengguna berapa yang menambahkan
 *              aktif:
 *                  type: int
 *                  description: sebagai flag apakah rumah itu masih berlaku atau tidak
 */

/**
 * @swagger
 * tags:
 *  name: Bulan
 *  description: API untuk Pendataan Penerbitan Bulan Tagihan
 */

/**
 * @swagger
 * /bulan:
 *  get:
 *      summary: untuk menampilkan semua data bulan, [Token Header]
 *      tags: [Bulan]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: jika data berhasil di fetch
 *          204:
 *              description: jika data yang dicari tidak ada
 *          400:
 *              description: kendala koneksi pool database
 *          401:
 *              description: token tidak valid
 *          500:
 *              description: kesalahan pada query sql
 */

async function getAllBulan(req, res) {
    const token = req.headers.authorization.split(' ')[1]
    try {
        jwt.verify(token, process.env.ACCESS_SECRET, (jwterror, jwtresult) => {
            if (jwterror) {
                return res.status(401).send({
                    message: "Sorry, Token tidak valid!",
                    error: jwterror
                })
            } else {
                pool.getConnection(function (error, database) {
                    if (error) {
                        return res.status(400).send({
                            message: "Pool refushed, sorry :(, try again or contact developer",
                            data: error
                        })
                    } else {
                        var sqlquery = "SELECT * FROM bulan"
                        database.query(sqlquery, (error, rows) => {
                            if (error) {
                                return res.status(500).send({
                                    message: "Sorry :(, my query has been error",
                                    data: error
                                });
                            } else {
                                if (rows.length <= 0) {
                                    return res.status(204).send({
                                        message: "Data masih kosong",
                                        data: rows
                                    });
                                } else {
                                    return res.status(200).send({
                                        message: "Data berhasil fetch.",
                                        data: rows
                                    });
                                }
                            }
                        })
                    }
                })
            }
        })
    } catch (error) {
        return res.status(403).send({
            message: "Forbidden.",
            error: error
        });
    }
}

/**
 * @swagger
 * /bulan/:tahun:
 *  get:
 *      summary: untuk menampilkan semua data bulan, [Token Header]
 *      tags: [Bulan]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: jika data berhasil di fetch
 *          204:
 *              description: jika data yang dicari tidak ada
 *          400:
 *              description: kendala koneksi pool database
 *          401:
 *              description: token tidak valid
 *          500:
 *              description: kesalahan pada query sql
 */

async function getDataBulanByTahun(req, res) {
    const token = req.headers.authorization.split(' ')[1]
    var tahun = req.params.tahun
    try {
        jwt.verify(token, process.env.ACCESS_SECRET, (jwterror, jwtresult) => {
            if (jwterror) {
                return res.status(401).send({
                    message: "Sorry, Token tidak valid!",
                    data: jwterror
                })
            } else {
                pool.getConnection(function (error, database) {
                    if (error) {
                        return res.status(400).send({
                            message: "Pool refushed, sorry :(, try again or contact developer",
                            data: error
                        })
                    } else {
                        var sqlquery = "SELECT * FROM bulan WHERE tahun = ?"
                        database.query(sqlquery, tahun, (error, rows) => {
                            if (error) {
                                return res.status(500).send({
                                    message: "Sorry :(, my query has been error",
                                    data: error
                                });
                            } else {
                                if (rows.length <= 0) {
                                    return res.status(204).send({
                                        message: "Data tidak ditemukan!",
                                        data: rows
                                    });
                                } else {
                                    return res.status(200).send({
                                        message: "Data berhasil fetch.",
                                        data: rows
                                    });
                                }
                            }
                        })
                    }
                })
            }
        })
    } catch (error) {
        return res.status(403).send({
            message: "Forbidden.",
            error: error
        });
    }
}

/**
 * @swagger
 * /bulan:
 *  post:
 *      summary: menambah data Bulan, [Token Header]
 *      tags: [Bulan]
 *      security:
 *          - bearerAuth: []
 *      consumes:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: parameter yang dikirim
 *            schema:
 *              properties:
 *                  nama_bulan: 
 *                      type: string
 *                  tahun:
 *                      type: year
 *                  keterangan:
 *                      type: string
 *                  aktif:
 *                      type: int
 *      responses:
 *          200:
 *              description: jika data berhasil di fetch
 *          204:
 *              description: jika data yang dicari tidak ada
 *          400:
 *              description: kendala koneksi pool database
 *          401:
 *              description: token tidak valid
 *          405:
 *              description: parameter yang dikirim tidak sesuai
 *          407:
 *              description: gagal generate encrypt password 
 *          500:
 *              description: kesalahan pada query sql
 */

async function addBulan(req, res) {
    var nama_bulan = req.body.nama_bulan
    var keterangan = req.body.keterangan
    var tahun = req.body.tahun
    var aktif = req.body.aktif
    const token = req.headers.authorization.split(' ')[1];
    if (Object.keys(req.body).length != 4) {
        return res.status(405).send({
            message: 'parameter tidak sesuai!'
        })
    } else {
        try {
            jwt.verify(token, process.env.ACCESS_SECRET, (jwterror, jwtresult) => {
                if (jwterror) {
                    return res.status(401).send({
                        message: "Sorry, Token tidak valid!",
                        data: jwterror
                    });
                } else {
                    pool.getConnection(function (error, database) {
                        if (error) {
                            return res.status(400).send({
                                message: "Soory, Pool Refushed",
                                data: error
                            });
                        } else {
                            database.beginTransaction(function (error) {
                                let databulan = {
                                    nama_bulan: nama_bulan,
                                    keterangan: keterangan,
                                    tahun: tahun,
                                    idpengguna: jwtresult.idpengguna,
                                    aktif: aktif
                                }
                                var sqlquery = "INSERT INTO bulan SET ?"
                                database.query(sqlquery, databulan, (error, result) => {
                                    if (error) {
                                        database.rollback(function () {
                                            database.release()
                                            return res.status(407).send({
                                                message: 'Sorry :(, we have problems sql query!',
                                                error: error
                                            })
                                        })
                                    } else {
                                        database.commit(function (errcommit) {
                                            if (errcommit) {
                                                database.rollback(function () {
                                                    database.release()
                                                    return res.status(407).send({
                                                        message: 'data gagal disimpan!'
                                                    })
                                                })
                                            } else {
                                                database.release()
                                                return res.status(201).send({
                                                    message: 'Data berhasil disimpan!'
                                                })
                                            }
                                        })
                                    }
                                })
                            })
                        }
                    })
                }
            })
        } catch (error) {
            return res.status(403).send({
                message: 'Email atau Nomor Handphone yang anda masukkan sudah terdaftar!'
            })
        }
    }
}

/**
 * @swagger
 * /bulan/:idbulan:
 *  put:
 *      summary: mengubah data bulan, [Token Header]
 *      tags: [Bulan]
 *      security:
 *          - bearerAuth: []
 *      consumes:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: parameter yang dikirim
 *            schema:
 *              properties:
 *                  nama_bulan: 
 *                      type: string
 *                  keterangan:
 *                      type: string
 *                  tahun:
 *                      type: year
 *                  aktif:
 *                      type: int
 *      responses:
 *          200:
 *              description: jika data berhasil di fetch
 *          204:
 *              description: jika data yang dicari tidak ada
 *          400:
 *              description: kendala koneksi pool database
 *          401:
 *              description: token tidak valid
 *          405:
 *              description: parameter yang dikirim tidak sesuai
 *          407:
 *              description: gagal generate encrypt password 
 *          500:
 *              description: kesalahan pada query sql
 */

async function ubahBulan(req, res) {
    var nama_bulan = req.body.nama_bulan
    var keterangan = req.body.keterangan
    var tahun = req.body.tahun
    var aktif = req.body.aktif
    var idbulan = req.params.idbulan
    const token = req.headers.authorization.split(' ')[1];
    if (Object.keys(req.body).length != 4) {
        return res.status(405).send({
            message: 'parameter tidak sesuai!'
        })
    } else {
        try {
            jwt.verify(token, process.env.ACCESS_SECRET, (jwterror, jwtresult) => {
                if (jwterror) {
                    return res.status(401).send({
                        message: "Sorry, Token tidak valid!",
                        data: jwterror
                    });
                } else {
                    pool.getConnection(function (error, database) {
                        if (error) {
                            return res.status(400).send({
                                message: "Soory, Pool Refushed",
                                data: error
                            });
                        } else {
                            database.beginTransaction(function (error) {
                                let databulan = {
                                    nama_bulan: nama_bulan,
                                    keterangan: keterangan,
                                    tahun: tahun,
                                    idpengguna: jwtresult.idpengguna,
                                    aktif: aktif
                                }
                                var sqlquery = "UPDATE bulan set ? WHERE idbulan = ?"
                                database.query(sqlquery, [databulan, idbulan], (error, result) => {
                                    if (error) {
                                        database.rollback(function () {
                                            database.release()
                                            return res.status(407).send({
                                                message: 'Sorry :(, we have problems sql query!'
                                            })
                                        })
                                    } else {
                                        database.commit(function (errcommit) {
                                            if (errcommit) {
                                                database.rollback(function () {
                                                    database.release()
                                                    return res.status(400).send({
                                                        message: 'data gagal disimpan!'
                                                    })
                                                })
                                            } else {
                                                database.release()
                                                return res.status(200).send({
                                                    message: 'Data berhasil disimpan!'
                                                })
                                            }
                                        })
                                    }
                                })
                            })
                        }
                    })
                }
            })
        } catch (error) {
            return res.status(403).send({
                message: 'Email atau Nomor Handphone yang anda masukkan sudah terdaftar!'
            })
        }
    }
}

module.exports = {
    getAllBulan,
    getDataBulanByTahun,
    addBulan,
    ubahBulan
}