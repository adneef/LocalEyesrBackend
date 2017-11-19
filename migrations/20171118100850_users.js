exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table
    .increments()

    table
    .varchar('google_id', 255)
    .notNullable()
    /* ------ uncomment after testing
     .unique()
     */

    table
    .timestamps(true, true)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users')
}
