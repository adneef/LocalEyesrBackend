const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
require('dotenv').config()

const index = require('./routes/index')
const users = require('./routes/users')
const passport = require('./services/passport')

const app = express()

/* ----------------- CORS fix, should we need it ------------------*/
/* ------------------ We need them now ---------------------------*/
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PATCH,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* ----------------- end CORS fix ------------------*/


app.use(cookieSession({
  name: 'bologna',
  keys: [`${process.env.COOKIE_KEY}`],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(passport.initialize())
app.use(passport.session())

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', index)
app.use('/users', users)

/*--------------------------- auth routes -------------------------- */

app.get('/auth/google', passport.authenticate('google', {scope: ['profile']}))

app.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/auth/google/success',
  failureRedirect: '/auth/google/failure'
}))

app.get('/auth/google/success', (req, res) => {
  res.send("successfully logged in")
})

app.get('/auth/google/failure', (req, res) => {
  res.send("zoinks, failure")
})

app.get('/auth/logout', (req, res) => {
  	req.logOut()
    res.send('successfully logged out')
})

/*--------------------------- auth routes end -------------------------- */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development'
    ? err
    : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
