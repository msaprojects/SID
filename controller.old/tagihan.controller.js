require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../utils/pool.configuration");

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
 *              - nominal
 *              - idbulan
 *              - idpengguna
 *              - aktif
 *          properties:
 *              idtagihan:
 *                  type: int
 *                  description: auto increment
 *              keterangan:
 *                  type: string
 *                  description: untuk mencatat tagihan
 *              nominal:
 *                  type: decimal
 *                  description: untuk menentukan nominal tagihan
 *              idbulan:
 *                  type: int
 *                  description: untuk mencatat id bulan yang akan di tagihkan
 *              idpengguna:
 *                  type: int
 *                  description: untuk mencatat id pengguna yang menambah atau mengedit data tagihan
 *              aktif:
 *                  type: int
 *                  description: untuk mencatat idpengguna berapa yang menambahkan
 *              created:
 *                  type: datetime
 *                  description: untuk mencatat kapan data ditambahkan
 *              edited:
 *                  type: datetime
 *                  description: suntuk mencatat kapan data terakhir di ubah
 */

/**
 * @swagger
 * tags:
 *  name: Tagihan
 *  description: API untuk menentukan tagihan
 */

/**
 * @swagger
 * /tagihan:
 *  get:
 *      summary: untuk menampilkan semua data tagihan aktif, [Token Header]
 *      tags: [Tagihan]
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

async function getSemuaTagihan(req, res) {
  const token = req.headers.authorization.split(" ")[1];
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
              message:
                "Pool refushed, sorry :(, try again or contact developer",
              data: error,
            });
          } else {
            console.log("Get Rumah...");
            var sqlquery = "SELECT * FROM tagihan";
            database.query(sqlquery, (error, rows) => {
              if (error) {
                return res.status(500).send({
                  message: "Sorry :(, my query has been error",
                  data: error,
                });
              } else {
                if (rows.length <= 0) {
                  return res.status(204).send({
                    message: "Data masih kosong",
                    data: rows,
                  });
                } else {
                  return res.status(200).send({
                    message: "Data berhasil fetch.",
                    data: rows,
                  });
                }
              }
            });
          }
        });
      }
    });
  } catch (error) {
    return res.status(403).send({
      message: "Forbidden.",
    });
  }
}

/**
 * @swagger
 * /tagihan:
 *  post:
 *      summary: menambah data Tagihan, [Token Header]
 *      tags: [Tagihan]
 *      security:
 *          - bearerAuth: []
 *      consumes:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: parameter yang dikirim
 *            schema:
 *              properties:
 *                  keterangan:
 *                      type: string
 *                  nominal:
 *                      type: string
 *                  idbulan:
 *                      type: string
 *                  aktif:
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

async function addTagihan(req, res) {
  var keterangan = req.body.keterangan;
  var nominal = req.body.nominal;
  var idbulan = req.body.idbulan;
  var aktif = req.body.aktif;
  const token = req.headers.authorization.split(" ")[1];
  if (Object.keys(req.body).length != 4) {
    return res.status(405).send({
      message: "parameter tidak sesuai!",
    });
  } else {
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
                let datatagihan = {
                  keterangan: keterangan,
                  nominal: nominal,
                  idbulan: idbulan,
                  idpengguna: jwtresult.idpengguna,
                  aktif: aktif,
                  created: new Date()
                    .toISOString()
                    .replace("T", " ")
                    .substring(0, 19),
                };
                var sqlquery = "INSERT INTO tagihan SET ?";
                database.query(sqlquery, datatagihan, (error, result) => {
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
              });
            }
          });
        }
      });
    } catch (error) {
      return res.status(403).send({
        message:
          "Email atau Nomor Handphone yang anda masukkan sudah terdaftar!",
      });
    }
  }
}

/**
 * @swagger
 * /tagihan/:idtagihan:
 *  put:
 *      summary: mengubah data tagihan, [Token Header]
 *      tags: [Tagihan]
 *      security:
 *          - bearerAuth: []
 *      consumes:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: parameter yang dikirim
 *            schema:
 *              properties:
 *                  idtagihan:
 *                      type: string
 *                  keterangan:
 *                      type: string
 *                  nominal:
 *                      type: string
 *                  idbulan:
 *                      type: string
 *                  aktif:
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

async function ubahTagihan(req, res) {
  var keterangan = req.body.keterangan;
  var nominal = req.body.nominal;
  var idbulan = req.body.idbulan;
  var aktif = req.body.aktif;
  var idtagihan = req.params.idtagihan;
  const token = req.headers.authorization.split(" ")[1];
  if (idtagihan == "" || idtagihan == null) {
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
              let datatagihan = {
                keterangan: keterangan,
                nominal: nominal,
                idbulan: idbulan,
                idpengguna: jwtresult.idpengguna,
                aktif: aktif,
                edited: new Date()
                  .toISOString()
                  .replace("T", " ")
                  .substring(0, 19),
              };
              var sqlquery = "UPDATE tagihan set ? WHERE idtagihan = ?";
              database.query(
                sqlquery,
                [datatagihan, idtagihan],
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
  getSemuaTagihan,
  addTagihan,
  ubahTagihan,
};
