import { CommandResults } from 'eris-boiler'
import { Command } from '@tagger'
import ownTag from '@tagger/permissions/own-tag'

export default new Command({
  name: 'remove',
  description: 'Add a tag',
  options: {
    aliases: [ 'delete', 'del', 'rm' ],
    parameters: [ 'tag id' ],
    permission: ownTag
  },
  run: function (bot, { params }): CommandResults {
    const id = params[0]
    if (!id) {
      return 'Missing id!'
    }

    return bot.getTag(id).then(async (tag) => {
      if (!tag) {
        return 'Tag doesn\'t exist'
      }

      await bot.removeTag(id)
      return `Deleted tag \`${id}\``
    })
  }
})
