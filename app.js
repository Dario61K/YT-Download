//require
const express = require('express')
const router = require('./routes/routes.js')
//config

const app = express()
app.disable('x-powered-by')
app.use(express.json({ limit: '10mb' }))
app.use('/', router)
app.use(express.static('./public'))


//server
app.listen(3000, () => {
    console.log(`server runing http://localhost:3000`)
})
