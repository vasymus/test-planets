// const http = require('http')
// ```shell
// openssl req -x509 -newkey rsa:4096 -nodes -keyout /opt/node_app/app/server/__testing_crt/key.pem -out /opt/node_app/app/server/__testing_crt/cert.pem -days 365
// ```
const fs = require('fs')
const path = require('path')
const https = require('https')

require('dotenv').config()

const app = require('./app')
const {mongoConnect} = require('./services/mongo')
const {loadPlanetsData} = require('./models/planets.model')
const {loadLaunchData} = require('./models/launches.model')


const PORT = process.env.PORT || 8000

const server = https.createServer({
    key: fs.readFileSync(path.join(__dirname, '..', '__testing_crt', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '..', '__testing_crt', 'cert.pem')),
}, app)

async function startServer() {
    await mongoConnect()
    await loadPlanetsData()
    await loadLaunchData()

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`)
    })
}

startServer()
