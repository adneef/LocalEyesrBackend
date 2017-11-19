exports.up = function(knex, Promise) {
  return knex.schema.createTable('searches', function(table) {
    table
    .increments()

    table
    .varchar('term', 255)

    table
    .integer('user_id')
    .references('id')
    .inTable('users')
    .onDelete('CASCADE')

    table
    .timestamps(true, true)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('searches')
}
