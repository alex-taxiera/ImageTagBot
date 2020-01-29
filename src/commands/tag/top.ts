import { CommandResults } from 'eris-boiler'
import { Command } from '@tagger'

export default new Command({
  name: 'top',
  description: 'top 10 tags', // TODO: add sub commands for guild/user top 10 ("help top" for filters)
  run: (bot): CommandResults => {
    return bot.getTags().then((tags) => {
      if (!tags.length) {
        return 'No tags found.'
      }

      return {
        embed: {
          title: 'Top 10 Tags!',
          description: tags
            .sort((a, b) => b.get('count') - a.get('count'))
            .slice(0, 10)
            .map((dbo) => `${dbo.get('id')} (${dbo.get('count')})`)
            .join('\n')
        }
      }
    })
  }
})
