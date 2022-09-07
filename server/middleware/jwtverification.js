require('dotenv').config()
const jwt = require('jsonwebtoken')

verifyToken = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        return res.status(403).send({
            message: 'Token Kosong!'
        })
    }
    jwt.verify(token.split(' ')[1], process.env.ACCESS_SECRET, (err, decode) => {
        if (err) {
            return res.status(401).send({ message: "Token tidak valid!" })
        }
        req.decode = decode
        next()
    })
}

module.exports = verifyToken