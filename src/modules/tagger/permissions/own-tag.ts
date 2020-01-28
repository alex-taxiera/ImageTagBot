import { Permission } from '@tagger'

export default new Permission({
  level: 800,
  reason: 'You do not own this tag!',
  run: async (bot, { msg, params }) => {
    const key = params[0]
    if (!key) {
      return false
    }

    let tag
    try {
      tag = await bot.getTag(key)
    } catch (error) {
      return false
    }
    if (!tag) {
      return false
    }

    return msg.author.id === tag.get('user')
  }
})
