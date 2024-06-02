const express = require('express')
const cors = require('cors')
const path = require('path')
const morgan = require('morgan')
const helmet = require('helmet')
const passport = require('passport')
const {Strategy} = require('passport-google-oauth20')
const cookieSession = require('cookie-session')

require('dotenv').config()

const api = require('./routes/api')

const app = express()

const config = {
    CLIENT_ID : process.env.GOOGLE_OAUTH_CLIENT_ID,
    CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    COOKIE_KEY_1: process.env.COOKIE_KEY_1,
    COOKIE_KEY_2: process.env.COOKIE_KEY_2,
}

const AUTH_OPTIONS = {
    callbackURL: '/auth/google/callback',
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
}

function verifyCB(accessToken, refreshToken, profile, done) {
    // console.log('Google profile', accessToken, refreshToken, profile, done)
    done(null, profile)
}
console.log('--- config', config, process.env)
passport.use(new Strategy(AUTH_OPTIONS, verifyCB))

// Save session to the cookie
passport.serializeUser((user, done) => { // saved user to cookie before send back to browser
    // console.log('--- serialize user', user)
    done(null, user.id)
})

// Read the session from the cookie
passport.deserializeUser((id, done) => { // first arg -- is defined by passport.serializeUser
    // console.log('--- deserialize object', id)
    // const user = await User.findById(id)
    // done(null, user)
    done(null, id)
})

app.use(helmet())
app.use(cookieSession({
    name: 'session',
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
}))
// fix of bug https://stackoverflow.com/a/75195471/12540255 -- register regenerate & save after the cookieSession middleware initialization
app.use(function(req, res, next) {
    if (req.session && !req.session.regenerate) {
        req.session.regenerate = (cb) => {
            cb()
        }
    }
    if (req.session && !req.session.save) {
        req.session.save = (cb) => {
            cb()
        }
    }
    next()
})
app.use(passport.initialize())
app.use(passport.session()) // set req.user property

function checkLoggedId(req, res, next) {
    console.log('Current user: ', req.user) // -- see passport.deserializeUser above
    const isLoggedIn = req.isAuthenticated() && !!req.user
    if (!isLoggedIn) {
        return res.status(401).send('<p><b>You must log in</b></p><p><a href="/index-auth.html">Back to index auth</a></p>')
    }

    next()
}

app.get('/auth/google', passport.authenticate('google', {
    scope: ['email']
}))

app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/failure',
    // successRedirect: '/',
    successRedirect: '/index-auth.html',
    session: true,
}), (req, res) => {
    console.log('Google called us back!')
})

app.get('/auth/logout', (req, res, next) => {
    req.logout(err => { // removes req.user and clears any logged-in session
        if (err) {
            return next(err)
        }
        return res.redirect('/index-auth.html')
    })
})

app.get('/failure', (req, res) => {
    return res.send('Failed to log in!')
})

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

app.get('/secret', checkLoggedId, (req, res) => {
    return res.send('<h1>Your personal secret value is 42!</h1><p><a href="/index-auth.html">Back to index auth</a></p>')
})

app.use('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

module.exports = app
