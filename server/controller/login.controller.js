//Plugin
require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mysql = require('mysql')
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    timezone: 'utc-8'
})

async function Login(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    console.log('Ada yang mencoba masuk')
    if (Object.keys(req.body).length != 2) {
        res.status(405).send({
            message: "Parameter tidak sesuai",
        })
    } else {
        try {
            pool.getConnection(function (error, database) {
                if (error) {
                    res.status(501).send({
                        message: "Soory, Pool Refushed",
                        data: error
                    })
                } else {
                    var sqlquery = "SELECT idpengguna, nama, jabatan, username, password, aktif FROM pengguna WHERE username = ?"
                    database.query(sqlquery, [username], function (error, rows) {
                        if (error) {
                            res.status(407).send({
                                message: "Sorry, sql query have problems",
                                data: error
                            })
                        } else {
                            if (!rows.length) {
                                res.status(400).send({
                                    message: "Username atau Password anda salah!",
                                });
                            } else if (rows[0].aktif == 0) {
                                res.status(200).send({
                                    message: "Akun anda tidak aktif",
                                });
                            } else {
                                bcrypt.compare(
                                    password,
                                    rows[0]['password'],
                                    (eErr, eResult) => {
                                        console.log(eResult);
                                        if (eErr) {
                                            console.log(eErr);
                                            return res.status(401).send({
                                                message: 'Username atau Password anda Salah!'
                                            });
                                        } else if (eResult) {
                                            console.log("Login Berhasil")
                                            const user = {
                                                idpengguna: rows[0].idpengguna,
                                            };
                                            const access_token = jwt.sign(user, process.env.ACCESS_SECRET, {
                                                expiresIn: process.env.ACCESS_EXPIRED
                                            })
                                            const refresh_token = jwt.sign(user, process.env.REFRESH_SECRET, {
                                                expiresIn: process.env.REFRESH_EXPIRED
                                            })
                                            refreshTokens.push(refresh_token)
                                            return res.status(200).send({
                                                message: 'Selamat, Anda Berhasil Login',
                                                access_token: access_token,
                                                refresh_token: refresh_token,
                                                nama: rows[0].nama,
                                                jabatan: rows[0].jabatan
                                            })
                                        } else {
                                            return res.status(401).send({
                                                message: 'Username atau Password salah'
                                            });
                                        }
                                    })
                            }
                        }
                    });
                }
            })
        } catch (error) {
            res.status(403).send({
                message: "Forbidden",
                error: error
            })
        }
    }
}

async function GenerateNewToken(req, res) {
    const refreshToken = req.body.refresh_token;
    console.log("refresh token di fungsi newtoken : " + refreshTokens);
    if (refreshToken == null) {
        return res.sendStatus(401)
    } else {
        try {
            const decoded = jwt.verify(
                refreshToken,
                process.env.REFRESH_SECRET
            );
            const user = {
                idpengguna: decoded.idpengguna
            }
            const accessToken = jwt.sign(user, process.env.ACCESS_SECRET, {
                expiresIn: process.env.ACCESS_EXPIRED
            });
            res.status(200).send({
                access_token: accessToken
            });
        } catch (error) {
            return res.status(401).send({
                message: 'Refresh token tidak valid'
            });
        }
    }
}

function generateToken(user) {
    return jwt.sign(user, process.env.ACCESS_SECRET, {
        expiresIn: process.env.ACCESS_EXPIRED
    });
}

module.exports = {
    Login,
    GenerateNewToken
}