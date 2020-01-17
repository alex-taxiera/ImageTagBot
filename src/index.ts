import {
  join
} from 'path'

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

import { ENV } from './types/env'
import {
  TaggerClient
} from '@tagger'
import {
  TagDatabaseManager
} from '@database-manager'

import {
  oratorOptions,
  statusManagerOptions
} from './config'

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
  databaseManager: new TagDatabaseManager({
    connectionInfo: TAG_DB_CONNECTION || {
      database: TAG_DB_NAME,
      user: TAG_DB_USER,
      password: TAG_DB_PASS,
      host: TAG_DB_HOST
    },
    client: TAG_DB_CLIENT
  }),
  oratorOptions,
  statusManagerOptions
})

bot
  .addCommands(join(__dirname, 'commands'))
  .connect()
