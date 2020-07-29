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

if (process.env.NODE_ENV === 'production') {
  require('docker-secret-env').load()
} else {
  require('dotenv').config()
}

const {
  DISCORD_TOKEN,
  IMGUR_CLIENT_ID,
  DB_CLIENT,
  DB_NAME,
  DB_USER,
  DB_PASS,
  DB_HOST
} = (process.env as unknown) as ENV

const bot = new TaggerClient(DISCORD_TOKEN, IMGUR_CLIENT_ID, {
  oratorOptions,
  statusManagerOptions,
  databaseManager: new SQLManager({
    connectionInfo: {
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASS,
      host: DB_HOST
    },
    client: DB_CLIENT
  })
})

bot
  .addCommands(join(__dirname, 'commands'))
  .connect()
  // eslint-disable-next-line no-console
  .catch(console.error)
