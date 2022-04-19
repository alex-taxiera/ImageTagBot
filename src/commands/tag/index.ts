import * as logger from 'eris-boiler/util/logger'
import fetch from 'node-fetch'

import {
  Command
} from '@tagger'

import add from './add'
import remove from './remove'
import update from './update'
import list from './list'
import search from './search'
import info from './info'
import top from './top'
import { cooldownMiddlewareFactory } from '@cooldown/middleware'
import { CooldownHandler } from '@cooldown/CooldownHandler'

export default new Command({
  name: 'tag',
  description: 'Finds, Adds, Remove, or Edit tags',
  options: {
    parameters: [ 'query' ],
    subCommands: [ add, remove, update, list, search, info, top ],
    middleware: [ cooldownMiddlewareFactory(new CooldownHandler()) ]
  },
  run: (bot, { params }) => {
    const query = params.join(' ')
    return bot.getTag(query).then(async (tag) => {
      if (!tag) {
        return `Tag \`${query}\` doesn't exists`
      }
      const src = tag.get('src') as string
      const res = await fetch(src)
      const ext = bot.IMAGE_REGEXP.exec(src.toLowerCase())?.pop() ?? ''
      bot.incrementTagCount(query)
        .catch((error) => logger.error('failed to count', error))

      return { file: { file: await res.buffer(), name: `${query}.${ext}` } }
    })
  }
})
