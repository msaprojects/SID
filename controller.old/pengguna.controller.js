require("dotenv").config();
const bcrypt = require("bcrypt");
const pool = require("../utils/pool.configuration");
const nows = require("../utils/golobal.variable");

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
 *              - username
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
  pool.getConnection(function (error, database) {
    if (error) {
      return res.status(400).send({
        message: "Pool refushed, sorry :(, try again or contact developer",
        error: error,
        data: null,
      });
    } else {
      var sqlquery =
        "SELECT idpengguna, nama, jabatan, username, aktif FROM pengguna";
      database.query(sqlquery, (error, rows) => {
        database.release();
        if (error) {
          return res.status(500).send({
            message: "Sorry :(, my query has been error",
            error: error,
            data: null,
          });
        } else {
          if (rows.length <= 0) {
            return res.status(204).send({
              message: "Data masih kosong",
              error: null,
              data: rows,
            });
          } else {
            return res.status(200).send({
              message: "Data berhasil fetch.",
              error: null,
              data: rows,
            });
          }
        }
      });
    }
  });
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
 *                  aktif:
 *                      type: integer
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
  var nama = req.body.nama;
  var username = req.body.username;
  var password = req.body.password;
  var jabatan = req.body.jabatan;
  var aktif = req.body.aktif;
  pool.getConnection(function (error, database) {
    if (error) {
      return res.status(400).send({
        message: "Sorry, Pool Refushed",
        error: error,
        data: null,
      });
    } else {
      database.beginTransaction(function (error) {
        bcrypt.hash(password, 10, (errorencrypt, encrypt) => {
          if (errorencrypt) {
            return res.status(407).send({
              message: "Gagal generate password!",
              error: errorencrypt,
              data: null,
            });
          } else {
            let datapengguna = {
              nama: nama,
              jabatan: jabatan,
              username: username,
              password: encrypt,
              aktif: aktif,
              created: nows.nows,
            };
            var sqlquery = "INSERT INTO pengguna SET ?";
            database.query(sqlquery, datapengguna, (error, result) => {
              database.release();
              if (error) {
                database.rollback(function () {
                  return res.status(407).send({
                    message: "Sorry :(, we have problems sql query!",
                    error: error,
                    data: null,
                  });
                });
              } else {
                database.commit(function (errcommit) {
                  if (errcommit) {
                    database.rollback(function () {
                      return res.status(407).send({
                        message: "data gagal disimpan!",
                        error: errcommit,
                        data: null,
                      });
                    });
                  } else {
                    return res.status(200).send({
                      message: "Data berhasil disimpan!",
                      error: null,
                      data: null,
                    });
                  }
                });
              }
            });
          }
        });
      });
    }
  });
}

/**
 * @swagger
 * /pengguna/:idpengguna:
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
 *                  aktif:
 *                      type: integer
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
  var idpengguna = req.params.idpengguna;
  var nama = req.body.nama;
  var jabatan = req.body.jabatan;
  var username = req.body.username;
  var password = req.body.password;
  var aktif = req.body.aktif;
  if (idpengguna == "" || idpengguna == null) {
    return res.status(400).send({
      message: "Parameter doesn't match!",
      error: null,
      data: null,
    });
  }
  pool.getConnection(function (error, database) {
    if (error) {
      return res.status(400).send({
        message: "Sorry, Pool Refushed",
        error: error,
        data: null,
      });
    } else {
      database.beginTransaction(function (error) {
        bcrypt.hash(password, 10, (errorencrypt, encrypt) => {
          if (errorencrypt) {
            return res.status(400).send({
              message: "Gagal generate password!",
              error: errorencrypt,
              data: null,
            });
          } else {
            let datapengguna = {
              nama: nama,
              jabatan: jabatan,
              username: username,
              password: encrypt,
              aktif: aktif,
              created: nows.nows,
            };
            var sqlquery = "UPDATE pengguna set ? WHERE idpengguna = ?";
            database.query(
              sqlquery,
              [datapengguna, idpengguna],
              (error, result) => {
                database.release();
                if (error) {
                  database.rollback(function () {
                    return res.status(407).send({
                      message: "Sorry :(, we have problems sql query!",
                      error: error,
                      data: null,
                    });
                  });
                } else {
                  database.commit(function (errcommit) {
                    if (errcommit) {
                      database.rollback(function () {
                        return res.status(400).send({
                          message: "data gagal disimpan!",
                          error: errcommit,
                          data: null,
                        });
                      });
                    } else {
                      return res.status(200).send({
                        message: "Data berhasil diperbarui!",
                        error: null,
                        data: null,
                      });
                    }
                  });
                }
              }
            );
          }
        });
      });
    }
  });
}

module.exports = {
  getAllPengguna,
  addPengguna,
  ubahPengguna,
};
