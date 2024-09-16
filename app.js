//require
const express = require('express')
const router = require('./routes/routes.js')
const dotenv = require('dotenv')

//config
dotenv.config()
const app = express()
app.disable('x-powered-by')
app.use(express.json({ limit: '10mb' }))
app.use('/', router)
app.use(express.static('./public'))


//server
PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`server runing http://localhost:3000`)
})
