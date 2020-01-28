import {
  join
} from 'path'
import {
  SQLManager
} from 'eris-boiler'

import { ENV } from './types/env'
import {
  TaggerClient
} from '@tagger'

import {
  oratorOptions,
  statusManagerOptions
} from './config'

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const {
  TAG_DISCORD_TOKEN,
  TAG_IMGUR_CLIENT_ID,
  TAG_DB_CLIENT,
  TAG_DB_NAME,
  TAG_DB_USER,
  TAG_DB_PASS,
  TAG_DB_HOST,
  TAG_DB_CONNECTION
} = (process.env as unknown) as ENV

const bot = new TaggerClient(TAG_DISCORD_TOKEN, TAG_IMGUR_CLIENT_ID, {
  oratorOptions,
  statusManagerOptions,
  databaseManager: new SQLManager({
    connectionInfo: TAG_DB_CONNECTION || {
      database: TAG_DB_NAME,
      user: TAG_DB_USER,
      password: TAG_DB_PASS,
      host: TAG_DB_HOST
    },
    client: TAG_DB_CLIENT
  })
})

bot
  .addCommands(join(__dirname, 'commands'))
  .connect()
