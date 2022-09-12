require("dotenv").config()
const loadModel = require('../models')
const PenggunaModel = loadModel.PenggunaModel
const Op = loadModel.Sequelize.Op
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { config } = require('dotenv');
exports.signIn = (req, res)=>{
    const {username, password} = req.body;
    PenggunaModel.findOne({
        where:{
            username: username
        }
    }).then((result) => {
        /// checking user name
        if(!result){
            return res.status(404).send({
                message: "username anda salah!"
            });
        }
        /// comparing password with bcrypt
        var passwordIsInvalid = bcrypt.compareSync(password, result.password);
        if(!passwordIsInvalid){
            return res.status(401).send({
                message: "password anda salah!"
            });
        }
        /// generate token validation
        var generateToken = jwt.sign({idpengguna: result.idpengguna}, process.env.ACCESS_SECRET, {expiresIn: process.env.ACCESS_EXPIRED});
        res.status(200).send({
            nama: result.nama,
            username: result.username,
            access_token: generateToken,
            jabatan: result.jabatan
        });
    }).catch((err) => {
        res.status(500).send({message: err.message});
    });
};