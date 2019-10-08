const { Command } = require('eris-boiler')

const ownTag = require('../../permissions/own-tag')

module.exports = new Command({
  name: 'remove',
  description: 'Add a tag',
  options: {
    aliases: ['delete', 'del', 'rm'],
    parameters: ['tag key'],
    permission: ownTag
  },
  run: async function ({ bot, params }) {
    const key = params[0]
    if (!key) return 'Missing key!'

    let tag
    try {
      tag = await bot.dbm.getTag(key)
    } catch (error) {
      return 'The database encountered an error!'
    }
    if (!tag) return 'Tag doesn\'t exist'

    await bot.dbm.removeTag(key)
    return `Deleted tag \`${key}\``
  }
})
