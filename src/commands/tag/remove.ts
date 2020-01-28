import { CommandResults } from 'eris-boiler'
import { Command } from '@tagger'
import ownTag from '@tagger/permissions/own-tag'

export default new Command({
  name: 'remove',
  description: 'Add a tag',
  options: {
    aliases: [ 'delete', 'del', 'rm' ],
    parameters: [ 'tag key' ],
    permission: ownTag
  },
  run: function (bot, { params }): CommandResults {
    const key = params[0]
    if (!key) {
      return 'Missing key!'
    }

    return bot.getTag(key).then(async (tag) => {
      if (!tag) {
        return 'Tag doesn\'t exist'
      }

      await bot.removeTag(key)
      return `Deleted tag \`${key}\``
    })
  }
})
