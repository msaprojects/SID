const express = require('express')
const app = express()
const cors = require('cors')
const router = require('./utils/router')
const docAuth = require('express-basic-auth')
const swaggeUI = require('swagger-ui-express')
const swaggerJS = require('swagger-jsdoc')
const path = require('path')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors());
//for allowing access images directory
app.use('/images', express.static(path.join(__dirname, '/images')))
//for base api url
app.use('/api/v1', router);
//for swagger setup documentation
const swaggerOption = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "Documentation of Sistem Informasi Desa [SID]",
            version: "1.0.0",
            description: "This documentation powered of MSADEV SOLUTION. you can access this api within `serverdomain/api/v1` first.",
            contact: {
                email: "msadev96@gmail.com",
                url: "msadev-solution.com"
            }
        },
        servers: [
            {
                url: process.env.DB_HOST,
                description: "For development url"
            }
        ]
    },
    apis: ["./controller/*.js"]
}
const specs = swaggerJS(swaggerOption)
app.use('/secret-docs-api', docAuth({
    users: {
        'admindoc': 'hanyasyahrulyangtau'
    },
    challenge: true
}), swaggeUI.serve, swaggeUI.setup(specs))
app.listen(process.env.API_PORT, () => console.log("Api Successfully Running on", process.env.TYPE_OF_DEPLOYMENT, " PORT API :", process.env.API_PORT, "Versi :", process.env.API_VERSION));