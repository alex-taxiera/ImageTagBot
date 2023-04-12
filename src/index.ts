import {
  Client,
  BotActivityType,
} from 'eris'
import { Hephaestus } from '@hephaestus/eris'
import config from 'config'
import {
  dirname,
  join,
} from 'path'
import { fileURLToPath } from 'url'
import type { Status } from '@prisma/client'
import { prisma } from '~modules/utils/db'

main().catch(console.error)// .finally(async () => await prisma.$disconnect())

async function main (): Promise<void> {
  const hephaestus = new Hephaestus(
    config.get('DISCORD_TOKEN'),
    { restMode: true, intents: [] },
  )
  hephaestus.commands.forge(
    join(dirname(fileURLToPath(import.meta.url)), 'commands'),
  )
  await hephaestus.connect().catch(console.error)
  return await manageStatus(hephaestus.client)
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
