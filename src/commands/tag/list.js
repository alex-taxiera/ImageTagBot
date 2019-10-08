const { Command } = require('eris-boiler')

module.exports = new Command({
  name: 'list',
  description: 'List your tags',
  run: async function ({ bot, msg }) {
    let tags
    try {
      tags = await bot.dbm.selectTagsForUser(msg.author.id)
    } catch (error) {
      return 'The database encountered an error!'
    }
    if (!tags) return 'No tags found for you.'

    return {
      embed: {
        title: `${msg.author.username}'s Tags`,
        description: tags.map(({ key, count }) => `${key} (${count})`).join('\n')
      }
    }
  }
})
