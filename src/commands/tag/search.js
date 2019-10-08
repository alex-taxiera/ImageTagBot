const { Command } = require('eris-boiler')

module.exports = new Command({
  name: 'search',
  description: 'Search all tags',
  options: {
    aliases: ['find'],
    parameters: ['query']
  },
  run: async function ({ bot, msg, params }) {
    const query = params[0]
    if (!query) return 'No query!'

    let tags
    try {
      tags = await bot.dbm.searchLikeTags(query)
    } catch (error) {
      return 'The database encountered an error!'
    }
    if (!tags || tags.length < 1) return 'No tags found.'

    return {
      embed: {
        title: 'Search Results',
        description: tags.map(({ key }) => key).join('\n')
      }
    }
  }
})
