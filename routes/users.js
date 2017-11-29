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
  .orderBy('searches.created_at', 'asc')
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

  let { term, id } = req.body
  console.log(term)
  console.log(id)

  if(!term || !term.trim()) {
    res.sendStatus(400)
    return
  }
  term = term.toLowerCase()
  console.log('term after lowercasing', term)

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

router.delete('/', (req, res, next) => {

  let { term, user_id } = req.body

  term = term.toLowerCase()

  knex('searches')
  .delete()
  .where('term', term)
  .then((row) => {
    if(row !== 1){
      console.log(row)
      console.log('bad request in delete while deleting')
      res.sendStatus(400)
      return
    }
    knex('searches')
    .select('term')
    .orderBy('searches.created_at', 'asc')
    .where('user_id', user_id)
    .then((searches) => {
      if(!searches) {
        console.log('bad request in delete while searching')
        res.sendStatus(400)
        return
      }
      res.send(searches)
      return
    })
  })
})

module.exports = router
