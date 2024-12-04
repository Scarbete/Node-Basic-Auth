const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('../apps/auth/router.js')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use('/auth', authRouter)

const PORT = process.env.PORT || 3000
const DB_URL = process.env.DB_URL

const startApp = async () => {
    try {
        await mongoose.connect(DB_URL)
        app.listen(PORT)
    }
    catch (error) {
        console.error(error)
    }
}

startApp()
    .then(() => console.log(`App started http://localhost:${PORT}`))
    .catch((error) => console.log(error))