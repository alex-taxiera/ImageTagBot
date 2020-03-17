
exports.up = (knex) => {
  return knex.schema.raw('CREATE EXTENSION IF NOT EXISTS CITEXT')
    .alterTable('tag', (t) => {
      t.dropPrimary()
    }).alterTable('tag', (t) => {
      t.specificType('id', 'CITEXT').primary().notNull().alter()
    })
}

exports.down = (knex) => {
  return knex.schema
    .alterTable('tag', (t) => {
      t.dropPrimary()
    }).alterTable('tag', (t) => {
      t.string('id').primary().notNull().alter()
    })
}
