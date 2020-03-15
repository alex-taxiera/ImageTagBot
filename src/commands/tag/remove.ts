import {
  CommandResults,
  DatabaseObject
} from 'eris-boiler'
import {
  Command
} from '@tagger'
import ownTag from '@tagger/permissions/own-tag'

export default new Command({
  name: 'remove',
  description: 'Add a tag',
  options: {
    aliases: [ 'delete', 'del', 'rm' ],
    parameters: [ 'tag id (can have multiple, separate by spaces)' ],
    permission: ownTag
  },
  run: function (bot, { params }): CommandResults {
    if (params.length < 1) {
      return 'Missing id!'
    }

    return Promise.all(params.map((id) => bot.getTag(id)))
      .then(async (dbos) => {
        const tags: Array<DatabaseObject> = []

        for (const tag of dbos) {
          if (!tag) {
            return 'There was a problem, please check the tag name.'
          }

          tags.push(tag)
        }

        await Promise.all(tags.map((tag) => bot.removeTag(tag.get('id'))))

        return 'Deleted!'
      })
  }
})
