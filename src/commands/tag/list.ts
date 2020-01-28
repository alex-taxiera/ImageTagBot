import { CommandResults } from 'eris-boiler'
import { Command } from '@tagger'

export default new Command({
  name: 'list',
  description: 'List your tags',
  run: function (bot, { msg }): CommandResults {
    return bot.getTagsForUser(msg.author.id).then((tags) => {
      if (!tags.length) {
        return 'No tags found for you.'
      }

      return {
        embed: {
          title: `${msg.author.username}'s Tags`,
          description: tags
            .map((dbo) => `${dbo.get('key')} (${dbo.get('count')})`)
            .join('\n')
        }
      }
    })
  }
})
