require("dotenv").config();
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
  pool.getConnection(function (error, database) {
    if (error) {
      return res.status(400).send({
        message: "Pool refushed, sorry :(, try again or contact developer",
        error: error,
        data: null,
      });
    } else {
      var sqlquery = "SELECT * FROM bulan";
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
  var tahun = req.params.tahun;
  if (tahun == "" || tahun == null) {
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
      var sqlquery = "SELECT * FROM bulan WHERE tahun = ? AND aktif = 1";
      database.query(sqlquery, tahun, (error, rows) => {
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
              message: "Data tidak masih kosong!",
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

async function addBulan(req, res, decode) {
  var nama_bulan = req.body.nama_bulan;
  var keterangan = req.body.keterangan;
  var tahun = req.body.tahun;
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
        let databulan = {
          nama_bulan: nama_bulan,
          keterangan: keterangan,
          tahun: tahun,
          idpengguna: decode.idpengguna,
          aktif: aktif,
        };
        var sqlquery = "INSERT INTO bulan SET ?";
        database.query(sqlquery, databulan, (error, result) => {
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
                return res.status(201).send({
                  message: "Data berhasil disimpan!",
                  error: null,
                  daa: null,
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

async function ubahBulan(req, res, decode) {
  var nama_bulan = req.body.nama_bulan;
  var keterangan = req.body.keterangan;
  var tahun = req.body.tahun;
  var aktif = req.body.aktif;
  var idbulan = req.params.idbulan;
  if (idbulan == "" || idbulan == null) {
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
        let databulan = {
          nama_bulan: nama_bulan,
          keterangan: keterangan,
          tahun: tahun,
          idpengguna: decode.idpengguna,
          aktif: aktif,
        };
        var sqlquery = "UPDATE bulan set ? WHERE idbulan = ?";
        database.query(sqlquery, [databulan, idbulan], (error, result) => {
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
                  message: "Data berhasil disimpan!",
                  error: null,
                  data: result,
                });
              }
            });
          }
        });
      });
    }
  });
}

module.exports = {
  getAllBulan,
  getDataBulanByTahun,
  addBulan,
  ubahBulan,
};
