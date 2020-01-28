import { CommandResults } from 'eris-boiler'
import { Command } from '@tagger'

export default new Command({
  name: 'search',
  description: 'Search all tags',
  options: {
    aliases: [ 'find' ],
    parameters: [ 'query' ]
  },
  run: function (bot, { params }): CommandResults {
    const query = params[0]
    if (!query) {
      return 'No query!'
    }

    return bot.searchSuggestions(query).then((tags) => {
      if (!tags.length) {
        return 'No tags found.'
      }

      return {
        embed: {
          title: 'Search Results',
          description: tags.map((dbo) => dbo.get('key')).join('\n')
        }
      }
    })
  }
})
