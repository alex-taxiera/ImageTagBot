import { CommandResults } from 'eris-boiler'
import { Command } from '@tagger'

export default new Command({
  name: 'add',
  description: 'Add a tag',
  options: {
    aliases: [ 'create' ],
    parameters: [ 'tag key' ]
  },
  run: function (bot, { msg, params }): CommandResults {
    const [ key, url ] = params
    const src = msg.attachments.length > 0 ? msg.attachments[0].url : url

    if (!key) {
      return 'Missing key!'
    }
    if (!src) {
      return 'Please attach an image or specify a url!'
    }
    if (!bot.IMAGE_REGEXP.test(src.toLowerCase())) {
      return 'Not an image!'
    }

    return bot.getTag(key).then(async (tag) => {
      if (tag) {
        return `Tag \`${key}\` already exists`
      }

      const newTag = await bot.uploadToImgur(src)
      await bot.upsertTag(key, { userId: msg.author.id, src: newTag.data.link })
      return `Added \`${key}\``
    })
  }
})
