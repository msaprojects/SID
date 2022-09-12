require("dotenv").config();
const jwt = require("jsonwebtoken");
var pool = require("./pool.configuration");

async function jwtVerify(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    console.log("no token");
    return res.status(401).send({
      message: "Sorry 😞, We need token to authorization.",
      error: null,
      data: null,
    });
  }
  try {
    const decode = jwt.verify(token.split(" ")[1], process.env.ACCESS_SECRET);
    req.decode = decode;
    /// checking api version and app version
    if (decode.appversion < process.env.APP_VERSION) {
      return res.status(401).send({
        message:
          "Sorry 😞, your apps too old, please update your apps or report to administrator.",
        error: null,
        data: null,
      });
    } else {
      /// checkin uuid in token and database active or deactive
      pool.getConnection(function (error, database) {
        if (error) {
          console.log("Pool Refused jwt..", error);
          return res.status(501).send({
            message: "Connection timeout.",
            data: error,
          });
        } else {
          /// if uuid successed will be return code belows
          next();
        }
      });
    }
  } catch (error) {
    console.log("Error JWT", error);
    return res.status(401).send({
      message:
        "Sorry 😞, your session has been expired, please logout and login again.",
      error: error,
      data: null,
    });
  }
}

module.exports = jwtVerify;
