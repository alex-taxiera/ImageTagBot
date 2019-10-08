const { Command } = require('eris-boiler')

module.exports = new Command({
  name: 'info',
  description: 'Get info on a tag.',
  options: {
    aliases: ['about'],
    parameters: ['tag key']
  },
  run: async function ({ bot, msg, params }) {
    const key = params[0]
    if (!key) return 'Missing key!'

    let tag
    try {
      tag = await bot.dbm.getTag(key)
    } catch (error) {
      return 'The database encountered an error!'
    }
    if (!tag) return `Tag \`${key}\` doesn't exists`

    const user = bot.users.get(tag.userId)

    return {
      embed: {
        author: {
          name: `${user.username}#${user.discriminator}`,
          icon_url: user.avatarURL
        },
        thumbnail: { url: bot.IMAGE_REGEXP.test(tag.src) ? tag.src : '' },
        fields: [
          {
            name: 'Tag Name',
            value: tag.key
          },
          {
            name: 'Tag Source',
            value: tag.src
          },
          {
            name: 'Use Count',
            value: tag.count
          }
        ]
      }
    }
  }
})
