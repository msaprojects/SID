require('dotenv').config()
const jwt = require('jsonwebtoken');

function isLoggedIn(req, res, next){
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_SECRET
        );
        req.dataPengguna = decoded;
        next();
    }catch(err){
        return res.status(401).send({
            statuscode:408,
            message: 'Sesi anda tidak valid'
        });
    }
}

module.exports = {
    isLoggedIn
}