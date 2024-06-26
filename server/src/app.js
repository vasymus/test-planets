const express = require('express')
const cors = require('cors')
const path = require('path')
const morgan = require('morgan')
const helmet = require('helmet')

require('dotenv').config()

const api = require('./routes/api')

const app = express()

// temporary comment out, because set 'Cross-Origin-Opener-Policy' to 'same-origin'
// which made src="/static/js/some.js" redirect to https
// app.use(helmet())

app.use(cors({
    origin: 'http://localhost:3000',
}))
app.use(
    morgan(
        'combined'
    )
)
app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use('/v1', api)

app.use('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

module.exports = app
