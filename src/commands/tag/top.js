const { Command } = require('eris-boiler')

module.exports = new Command({
  name: 'top',
  description: 'top 10 tags',
  options: {
    deleteResponse: false
  },
  run: async ({ bot }) => {
    let tags
    try {
      tags = await bot.dbm.selectAllTags()
    } catch (error) {
      return 'The database encountered an error!'
    }
    if (!tags || tags.length < 1) return 'No tags found.'

    return {
      embed: {
        title: 'Top 10 Tags!',
        description: tags
          .sort(({ count: a }, { count: b }) => b - a)
          .slice(0, 10)
          .map(({ key, count }) => `${key} (${count})`)
          .join('\n')
      }
    }
  }
})
