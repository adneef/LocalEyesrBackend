const express = require('express')
const router = express.Router()
const knex = require('../knex')

/* GET users listing. */
router.get('/', function(req, res, next) {

  knex('users')
  .select('id', 'google_id')
  .then((allUsers) => {
    if(!allUsers) {
      res.sendStatus(404)
      return
    }
    res.send(allUsers)
  })
})

// GET a specific user's searches and id
router.get('/:id', (req, res, next) => {

  let id = Number(req.params.id)
  // let id = req.user

  if(Number.isNaN(id)) {
    res.sendStatus(400)
    return
  }

  knex('users')
  .select('users.id', 'term')
  .where('searches.user_id', id)
  .orderBy('searches.created_at', 'desc')
  .innerJoin('searches', 'searches.user_id', 'users.id')
  .then((user) => {
    if(!user) {
      res.sendStatus(404)
      return
    }
    res.send(user)
  })
})

// POST a new search term to the db
router.post('/', (req, res, next) => {

  const { term, id } = req.body

  if(!term || !term.trim()) {
    res.sendStatus(400)
    return
  }

  knex('searches')
  .returning('term')
  .insert( {term: term, user_id: id})
  .then((newTerm) => {
    if(!newTerm) {
      res.sendStatus(404)
      return
    }
    res.send(newTerm)
  })
})

module.exports = router
