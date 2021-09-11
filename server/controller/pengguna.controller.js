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
 *      pengguna:
 *          type: object
 *          required:
 *              - nama
 *              - jabatan
 *              - username
 *              - password
 *          properties:
 *              idpengguna:
 *                  type: int
 *                  description: auto increment
 *              nama: 
 *                  type: string
 *                  description: nama pengguna
 *              jabatan:
 *                  type: string
 *                  description: jabatan pengguna untuk menentukan role
 *              username:
 *                  type: string
 *                  description: sebagai login aplikasi
 *              password:
 *                  type: string
 *                  description: sebagai autentikasi login aplikasi
 *              aktif:
 *                  type: int
 *                  description: sebagai flag untuk menentukan apakah user masih aktif atau tidak
 *              created:
 *                  type: datetime
 *                  description: untuk mencatat kapan data ditambahkan
 */

/**
 * @swagger
 * tags:
 *  name: Pengguna
 *  description: API untuk Pendataan Pengguna
 */

/**
 * @swagger
 * /pengguna:
 *  get:
 *      summary: untuk menampilkan semua data pengguna, [header token]
 *      tags: [Pengguna]
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

async function getAllPengguna(req, res) {
    const token = req.headers.authorization.split(' ')[1]
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
                        var sqlquery = "SELECT idpengguna, nama, jabatan, username, aktif FROM pengguna"
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
            data: rows
        });
    }
}

/**
 * @swagger
 * /pengguna:
 *  post:
 *      summary: menambah data pengguna, dan password di encrypt
 *      tags: [Pengguna]
 *      security:
 *          - bearerAuth: []
 *      consumes:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: parameter yang dikirim
 *            schema:
 *              properties:
 *                  nama: 
 *                      type: string
 *                  jabatan:
 *                      type: string
 *                  username:
 *                      type: string
 *                  password:
 *                      type: string
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

async function addPengguna(req, res) {
    var nama = req.body.nama
    var jabatan = req.body.jabatan
    var username = req.body.username
    var password = req.body.password
    var aktif = req.body.aktif
    const token = req.headers.authorization.split(' ')[1];
    if (Object.keys(req.body).length != 5) {
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
                                bcrypt.hash(password, 10, (errorencrypt, encrypt) => {
                                    if (errorencrypt) {
                                        return res.status(407).send({
                                            message: 'Gagal generate password!'
                                        });
                                    } else {
                                        let datapengguna = {
                                            nama: nama,
                                            jabatan: jabatan,
                                            username: username,
                                            password: encrypt,
                                            aktif: aktif,
                                            created: new new Date().toISOString().replace('T', ' ').substring(0,19)
                                        }
                                        var sqlquery = "INSERT INTO pengguna SET ?"
                                        database.query(sqlquery, datapengguna, (error, result) => {
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
                                                        return res.status(200).send({
                                                            message: 'Data berhasil disimpan!'
                                                        })
                                                    }
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
 * /pengguna:
 *  put:
 *      summary: mengubah data pengguna, dan password di encrypt
 *      tags: [Pengguna]
 *      security:
 *          - bearerAuth: []
 *      consumes:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: parameter yang dikirim
 *            schema:
 *              properties:
 *                  nama: 
 *                      type: string
 *                  jabatan:
 *                      type: string
 *                  username:
 *                      type: string
 *                  password:
 *                      type: string
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

async function ubahPengguna(req, res) {
    var nama = req.body.nama
    var jabatan = req.body.jabatan
    var username = req.body.username
    var password = req.body.password
    var aktif = req.body.aktif
    const token = req.headers.authorization.split(' ')[1];
    if (Object.keys(req.body).length != 5) {
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
                                bcrypt.hash(password, 10, (errorencrypt, encrypt) => {
                                    if (errorencrypt) {
                                        return res.status(400).send({
                                            message: 'Gagal generate password!'
                                        });
                                    } else {
                                        let datapengguna = {
                                            nama: nama,
                                            jabatan: jabatan,
                                            username: username,
                                            password: encrypt,
                                            aktif: aktif,
                                            created: new new Date().toISOString().replace('T', ' ').substring(0,19)
                                        }
                                        var sqlquery = "UPDATE pengguna set ? WHERE idpengguna = ?"
                                        database.query(sqlquery, [datapengguna, jwtresult.idpengguna], (error, result) => {
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
    getAllPengguna,
    addPengguna,
    ubahPengguna
}