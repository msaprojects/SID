const mysql = require('mysql')
var conn = ""
//for checking database connection status
function startConnection(){
    console.log('Trying to connect database...')
    conn = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        timezone: 'utc-8'
    })
    conn.connect(function (error){
        if(error){
            console.log('Sorry, your database connection refushed :', error)
        }else{
            console.log('Yeay!, your database connection successfully...')
        }
    })
}

startConnection()
//agar mysql tidak sleep
setInterval(() => {
    console.log('Wake Up mysql!')
    conn.query('SELECT 1')
}, 360000);