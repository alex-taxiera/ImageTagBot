import { CommandResults } from 'eris-boiler'
import { Command } from '@tagger'

export default new Command({
  name: 'add',
  description: 'Add a tag',
  options: {
    aliases: [ 'create' ],
    parameters: [ 'tag id' ]
  },
  run: function (bot, { msg, params }): CommandResults {
    const [ id, url ] = params
    const src = msg.attachments.length > 0 ? msg.attachments[0].url : url

    if (!id) {
      return 'Missing id!'
    }
    if (!src) {
      return 'Please attach an image or specify a url!'
    }
    if (!bot.IMAGE_REGEXP.test(src.toLowerCase())) {
      return 'Not an image!'
    }

    return bot.getTag(id).then(async (tag) => {
      if (tag) {
        return `Tag \`${id}\` already exists`
      }

      const newSrc = await bot.uploadToImgur(src)
      await bot.upsertTag(id, { user: msg.author.id, src: newSrc })
      return `Added \`${id}\``
    })
  }
})
