const { Permission } = require('eris-boiler')

module.exports = new Permission({
  level: 800,
  reason: 'You do not own this tag!',
  run: async ({ bot, msg, params }) => {
    const key = params[0]
    if (!key) return false

    let tag
    try {
      tag = await bot.dbm.getTag(key)
    } catch (error) {
      return false
    }
    if (!tag) return false

    return msg.author.id === tag.userId
  }
})
