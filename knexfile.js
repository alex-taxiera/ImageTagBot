require('docker-secret-env').load()

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const {
  DB_CLIENT,
  DB_NAME,
  DB_USER,
  DB_PASS,
  DB_HOST,
  ADMIN_DB_USER,
  ADMIN_DB_PASS
} = process.env

module.exports = {
  production: {
    client: DB_CLIENT,
    connection: {
      host: DB_HOST,
      database: DB_NAME,
      user: ADMIN_DB_USER,
      password: ADMIN_DB_PASS
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  development: {
    ...module.exports.production,
    connection: {
      host: DB_HOST,
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASS
    }
  }
}
