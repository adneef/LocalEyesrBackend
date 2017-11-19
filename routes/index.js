const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('hitting index route')
  res.send(JSON.stringify(req.user))
  // res.render('index', { title: 'Prepare to be routed' })
})

module.exports = router
