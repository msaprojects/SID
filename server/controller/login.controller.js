//Plugin
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../utils/pool.configuration");

async function Login(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var device = req.body.device;
  var appversion = req.body.appversion;
  if (appversion < process.env.APP_VERSION) {
    res.status(401).send({
      message: "Maaf, versi aplikasi anda sudah terlalu tua :(",
      error: null,
      data: null,
    });
  } else {
    try {
      pool.getConnection(function (error, database) {
        if (error) {
          res.status(501).send({
            message: "Sorry, Pool Refushed",
            error: error,
            data: null,
          });
        } else {
          var sqlquery =
            "SELECT idpengguna, nama, jabatan, username, password, aktif FROM pengguna WHERE username = ? AND aktif=1";
          database.query(sqlquery, [username], function (error, rows) {
            database.release();
            if (error) {
              res.status(407).send({
                message: "Sorry, sql query have problems",
                error: error,
                data: null,
              });
            } else {
              if (!rows.length) {
                res.status(400).send({
                  message: "Username atau Password anda salah!",
                  error: error,
                  data: null,
                });
              } else if (rows[0].aktif == 0) {
                res.status(200).send({
                  message: "Akun anda tidak aktif",
                  error: error,
                  data: null,
                });
              } else {
                bcrypt.compare(
                  password,
                  rows[0]["password"],
                  (eErr, eResult) => {
                    console.log(eResult);
                    if (eResult) {
                      console.log("Login Berhasil");
                      const user = {
                        idpengguna: rows[0].idpengguna,
                        appversion: appversion,
                        device: device,
                      };
                      const access_token = jwt.sign(
                        user,
                        process.env.ACCESS_SECRET,
                        {
                          expiresIn: process.env.ACCESS_EXPIRED,
                        }
                      );

                      return res.status(200).send({
                        message: "Selamat, Anda Berhasil Login",
                        access_token: access_token,
                        nama: rows[0].nama,
                        jabatan: rows[0].jabatan,
                      });
                    } else {
                      return res.status(401).send({
                        message: "Username atau Password salah",
                        error: eErr,
                        data: null,
                      });
                    }
                  }
                );
              }
            }
          });
        }
      });
    } catch (error) {
      res.status(403).send({
        message: "Forbidden",
        error: error,
        data: null,
      });
    }
  }
}

module.exports = {
  Login,
};
