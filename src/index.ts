import {
  Client,
  BotActivityType,
} from 'eris'
import { Forge } from '@hephaestus/eris'
import config from 'config'
import {
  dirname,
  join,
} from 'path'
import { fileURLToPath } from 'url'
import { Status } from '@prisma/client'
import { prisma } from '@utils/db'

main().catch(() => undefined)// .finally(async () => await prisma.$disconnect())

async function main (): Promise<void> {
  const client = new Forge(config.get('DISCORD_TOKEN'))
  client.commands.add(join(dirname(fileURLToPath(import.meta.url)), 'commands'))
  // eslint-disable-next-line no-console
  await client.connect().catch(console.error)
  void manageStatus(client.client)
}

async function manageStatus (client: Client): Promise<void> {
  let current: Status | undefined

  enum STATUS_TYPES {
    Playing = 0,
    Streaming,
    Listening,
    Watching,
    Competing = 5,
  }

  const update = async (): Promise<void> => {
    const nextStatus = await prisma.status.findFirst({
      where: {
        name: { not: current?.name },
      },
    })
    if (nextStatus) {
      current = nextStatus
      // eslint-disable-next-line no-console
      console.log(`${STATUS_TYPES[nextStatus.type] ?? ''} ${nextStatus.name}`)
      client.editStatus({
        ...nextStatus,
        type: nextStatus.type as BotActivityType,
      })
    }
  }

  await update()

  setInterval(update, 1000 * 60 * 12)
}
