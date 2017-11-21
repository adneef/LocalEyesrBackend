exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('searches').del()
    .then(function () {
      // Inserts seed entries
      return knex('searches').insert([
        {
          id: 1,
          term: 'blakeshelton',
          user_id: 1
        },
        {
        id: 2,
        term: 'bologna',
        user_id: 1
        },
        {
        id: 3,
        term: 'burrito',
        user_id: 2
        },
        {
        id: 4,
        term: 'cheese',
        user_id: 2
        }
      ])
    })
  .then(() => {
    return knex.raw("SELECT setval('searches_id_seq', (SELECT MAX(id) FROM searches))")
  })
}
