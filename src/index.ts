import { Forge } from '@hephaestus/eris'
import config from 'config'

// import { prisma } from '@utils/db'

main().catch(() => undefined)// .finally(async () => await prisma.$disconnect())

// const exampleCommand: TopLevelCommand = {
//   type: 1,
//   guildId: '436591833196265473',
//   name: 'example',
//   description: 'example description',
//   action: (interaction, client) => {
//     void interaction.createMessage('example message')
//   },
// }

// const readyEvent: Event = {
//   name: 'ready',
//   handler: () => console.log('ready'),
// }

async function main (): Promise<void> {
  if (config.get('NODE_ENV') === 'production') {
    await import('docker-secret-env').then(({ load }) => load())
  } else {
    await import('dotenv').then(({ config }) => config())
  }

  const client = new Forge(config.get('DISCORD_TOKEN'))

  // client.commands.add(join(__dirname, 'commands'))
  // client.events.add([ readyEvent ])
  // client.commands.add([ exampleCommand ])
  client.connect().catch(console.error)
}
