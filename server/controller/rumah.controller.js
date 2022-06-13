require("dotenv").config();
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
 *      nomor_rumah:
 *          type: object
 *          required:
 *              - kode
 *              - keterangan
 *              - jenis_rumah
 *              - barcode_gen
 *              - aktif
 *          properties:
 *              idnomor_rumah:
 *                  type: int
 *                  description: auto increment
 *              kode:
 *                  type: string
 *                  description: kode rumah
 *              keterangan:
 *                  type: string
 *                  description: keterangan rumah
 *              jenis_rumah:
 *                  type: string
 *                  description: jenis rumah kosan atau rumah permanen
 *              barcode_gen:
 *                  type: string
 *                  description: qrcode generator
 *              idpengguna:
 *                  type: int
 *                  description: untuk mencatat idpengguna berapa yang menambahkan
 *              created:
 *                  type: datetime
 *                  description: untuk mencatat kapan data ditambahkan
 *              aktif:
 *                  type: int
 *                  description: sebagai flag apakah rumah itu masih berlaku atau tidak
 */

/**
 * @swagger
 * tags:
 *  name: Rumah
 *  description: API untuk Pendataan Rumah
 */

/**
 * @swagger
 * /rumah:
 *  get:
 *      summary: untuk menampilkan semua data rumah, [Token Header]
 *      tags: [Rumah]
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

async function getAllRumah(req, res) {
  pool.getConnection(function (error, database) {
    if (error) {
      return res.status(400).send({
        message: "Pool refushed, sorry :(, try again or contact developer",
        error: error,
        data: null,
      });
    } else {
      var sqlquery = "SELECT * FROM rumah";
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
 * /rumah/:barcode_gen:
 *  get:
 *      summary: untuk menampilkan semua data rumah, [Token Header]
 *      tags: [Rumah]
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

async function getDetailRumah(req, res) {
  var barcode_gen = req.params.barcode_gen;
  if (barcode_gen == "" || barcode_gen == null) {
    return res.status(400).send({
      message: "Parameter doesn't match!",
      error: null,
      data: null,
    });
  }
  pool.getConnection(function (error, database) {
    if (error) {
      return res.status(400).send({
        message: "Pool refushed, sorry :(, try again or contact developer",
        error: error,
        data: null,
      });
    } else {
      var sqlquery = "SELECT * FROM nomor_rumah WHERE barcode_gen = ?";
      database.query(sqlquery, barcode_gen, (error, rows) => {
        database.release();
        if (error) {
          return res.status(500).send({
            message: "Sorry :(, my query has been error",
            error: error,
            data: null,
          });
        } else {
          if (rows.length <= 0) {
            return res.status(200).send({
              message: "Data tidak ditemukan!",
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
 * /rumah:
 *  post:
 *      summary: menambah data Rumah, [Token Header]
 *      tags: [Rumah]
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

async function addRumah(req, res) {
  var kode = req.body.kode;
  var keterangan = req.body.keterangan;
  var jenis_rumah = req.body.jenis_rumah;
  var aktif = req.body.aktif;
  pool.getConnection(function (error, database) {
    bcrypt.hash(jenis_rumah, 4, (errorencrypt, encrypt) => {
      if (errorencrypt) {
        return res.status(400).send({
          message: "Gagal generate password!",
        });
      } else {
        if (error) {
          return res.status(400).send({
            message: "Soory, Pool Refushed",
            data: error,
          });
        } else {
          database.beginTransaction(function (error) {
            let datarumah = {
              kode: kode,
              keterangan: keterangan,
              jenis_rumah: jenis_rumah,
              barcode_gen: encrypt,
              idpengguna: jwtresult.idpengguna,
              aktif: aktif,
              created: new Date()
                .toISOString()
                .replace("T", " ")
                .substring(0, 19),
            };
            var sqldatafilter = "SELECT * FROM nomor_rumah WHERE kode = ?";
            database.query(sqldatafilter, kode, (error, result) => {
              if (error) {
                database.rollback(function () {
                  database.release();
                  return res.status(407).send({
                    message: "Sorry :(, we have problems sql query!",
                    error: error,
                  });
                });
              } else {
                if (result.length <= 0) {
                  var sqlquery = "INSERT INTO nomor_rumah SET ?";
                  database.query(sqlquery, datarumah, (error, result) => {
                    if (error) {
                      database.rollback(function () {
                        database.release();
                        return res.status(407).send({
                          message: "Sorry :(, we have problems sql query!",
                          error: error,
                        });
                      });
                    } else {
                      database.commit(function (errcommit) {
                        if (errcommit) {
                          database.rollback(function () {
                            database.release();
                            return res.status(407).send({
                              message: "data gagal disimpan!",
                            });
                          });
                        } else {
                          database.release();
                          return res.status(200).send({
                            message: "Data berhasil disimpan!",
                          });
                        }
                      });
                    }
                  });
                } else {
                  return res.status(400).send({
                    message: `Kode ${kode} sudah terdaftar!`,
                  });
                }
              }
            });
          });
        }
      }
    });
  });
}

/**
 * @swagger
 * /rumah/:idnomor_rumah:
 *  put:
 *      summary: mengubah data rumah, [Token Header]
 *      tags: [Rumah]
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

async function ubahRumah(req, res) {
  var kode = req.body.kode;
  var keterangan = req.body.keterangan;
  var jenis_rumah = req.body.jenis_rumah;
  var aktif = req.body.aktif;
  var idrumah = req.params.idrumah;
  const token = req.headers.authorization.split(" ")[1];
  if (idrumah == "" || idrumah == null) {
    return res.status(400).send({
      message: "Parameter doesn't match!",
      error: null,
      data: null,
    });
  }
  try {
    jwt.verify(token, process.env.ACCESS_SECRET, (jwterror, jwtresult) => {
      if (jwterror) {
        return res.status(401).send({
          message: "Sorry, Token tidak valid!",
          data: jwterror,
        });
      } else {
        pool.getConnection(function (error, database) {
          if (error) {
            return res.status(400).send({
              message: "Soory, Pool Refushed",
              data: error,
            });
          } else {
            database.beginTransaction(function (error) {
              let datarumah = {
                kode: kode,
                keterangan: keterangan,
                jenis_rumah: jenis_rumah,
                idpengguna: jwtresult.idpengguna,
                aktif: aktif,
              };
              var sqlquery = "UPDATE nomor_rumah set ? WHERE idnomor_rumah = ?";
              database.query(
                sqlquery,
                [datarumah, idnomor_rumah],
                (error, result) => {
                  if (error) {
                    database.rollback(function () {
                      database.release();
                      return res.status(407).send({
                        message: "Sorry :(, we have problems sql query!",
                        error: error,
                      });
                    });
                  } else {
                    database.commit(function (errcommit) {
                      if (errcommit) {
                        database.rollback(function () {
                          database.release();
                          return res.status(400).send({
                            message: "data gagal disimpan!",
                          });
                        });
                      } else {
                        database.release();
                        return res.status(200).send({
                          message: "Data berhasil disimpan!",
                        });
                      }
                    });
                  }
                }
              );
            });
          }
        });
      }
    });
  } catch (error) {
    return res.status(403).send({
      message: "Email atau Nomor Handphone yang anda masukkan sudah terdaftar!",
    });
  }
}

module.exports = {
  getAllRumah,
  getDetailRumah,
  addRumah,
  ubahRumah,
};
