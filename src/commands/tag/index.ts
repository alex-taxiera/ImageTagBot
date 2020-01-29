import {
  CommandResults
} from 'eris-boiler'
import * as logger from 'eris-boiler/util/logger'

import request from '@http'
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

export default new Command({
  name: 'tag',
  description: 'Finds, Adds, Remove, or Edit tags',
  options: {
    parameters: [ 'query' ],
    subCommands: [ add, remove, update, list, search, info, top ]
  },
  run: (bot, { params }): CommandResults => {
    const query = params[0]
    return bot.getTag(query).then(async (tag) => {
      if (!tag) {
        return `Tag \`${query}\` doesn't exists`
      }
      const src = tag.get('src')
      const { body } = await request(src)
      const ext = src.toLowerCase().match(bot.IMAGE_REGEXP).pop()
      bot.incrementTagCount(query)
        .catch((error) => logger.error('failed to count', error))

      return { file: { file: body, name: `${query}.${ext}` } }
    })
  }
})
