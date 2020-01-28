if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const {
  NODE_ENV,
  TAG_DB_CLIENT,
  TAG_DB_NAME,
  TAG_DB_USER,
  TAG_DB_PASS,
  TAG_DB_HOST,
  TAG_DB_CONNECTION
} = process.env

module.exports = {
  [NODE_ENV]: {
    client: TAG_DB_CLIENT,
    connection: TAG_DB_CONNECTION || {
      host: TAG_DB_HOST,
      database: TAG_DB_NAME,
      user: TAG_DB_USER,
      password: TAG_DB_PASS
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}
