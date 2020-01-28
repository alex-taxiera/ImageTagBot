
exports.up = (knex) => {
  return knex.schema.createTable('tag', (t) => {
    t.string('id').primary().notNull()
    t.string('user').notNull()
    t.string('src').notNull()
    t.integer('count').notNull().defaultTo(0)
  })
}

exports.down = (knex) => {
  return knex.schema.dropTable('tag')
}
