const { join } = require('path')
const { config: envLoad } = require('dotenv')

const TaggerClient = require('./tagger')

envLoad()

const {
  oratorOptions,
  statusManagerOptions
} = require('../config/settings.json')

const {
  TAG_TOKEN,
  TAG_DB_CLIENT,
  TAG_DB_NAME,
  TAG_DB_USER,
  TAG_DB_PASS,
  TAG_DB_HOST
} = process.env

const bot = new TaggerClient(TAG_TOKEN, {
  dbInfo: {
    connectionInfo: {
      database: TAG_DB_NAME,
      user: TAG_DB_USER,
      password: TAG_DB_PASS,
      host: TAG_DB_HOST
    },
    client: TAG_DB_CLIENT
  },
  oratorOptions,
  statusManagerOptions
})

bot
  .addCommands(join(__dirname, '/commands'))
  .connect()
