import {
  Event,
  Forge,
  TopLevelCommand,
} from '@hephaestus/eris'

import { ENV } from './types/env'

main().catch(() => undefined)

const exampleCommand: TopLevelCommand = {
  type: 1,
  guildId: '436591833196265473',
  name: 'example',
  description: 'example description',
  action: (interaction, client) => {
    void interaction.createMessage('example message')
  },
}

const readyEvent: Event = {
  name: 'ready',
  handler: () => console.log('ready'),
}

async function main (): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    await import('docker-secret-env').then(({ load }) => load())
  } else {
    await import('dotenv').then(({ config }) => config())
  }

  const {
    DISCORD_TOKEN,
    // IMGUR_CLIENT_ID,
    // DB_CLIENT,
    // DB_NAME,
    // DB_USER,
    // DB_PASS,
    // DB_HOST,
  } = (process.env as unknown) as ENV

  // const bot = new TaggerClient(DISCORD_TOKEN, IMGUR_CLIENT_ID, {
  //   oratorOptions,
  //   statusManagerOptions,
  //   databaseManager: new SQLManager({
  //     connectionInfo: {
  //       database: DB_NAME,
  //       user: DB_USER,
  //       password: DB_PASS,
  //       host: DB_HOST
  //     },
  //     client: DB_CLIENT
  //   })
  // })

  const client = new Forge(DISCORD_TOKEN)

  // client.commands.add(join(__dirname, 'commands'))
  client.events.add([ readyEvent ])
  client.commands.add([ exampleCommand ])
  client.connect().catch(console.error)
}
