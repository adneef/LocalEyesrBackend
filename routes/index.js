const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('hitting index route', req.session)
  // res.send([req.user])
  console.log(req.session.passport.user)
  // res.render('http://localhost:3000', req.session.passport.user)
  res.render('index', {title: 'Prepare to be routed'})
})

module.exports = router
