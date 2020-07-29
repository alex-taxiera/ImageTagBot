import { CommandResults } from 'eris-boiler'
import { Command } from '@tagger'
import { ImgurError } from '@tagger/exceptions'

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

    return bot.getTag(id).then(async (tag) => {
      if (tag) {
        return `Tag \`${id}\` already exists`
      }

      let newSrc: string | undefined
      try {
        await msg.channel.sendTyping()
        newSrc = await bot.uploadToImgur(src)
      } catch (e) {
        if (e instanceof ImgurError) {
          switch (e.code) {
            case 1003: return 'Bad URL!'
            default: return 'Unknown error!'
          }
        } else {
          throw e
        }
      }
      await bot.upsertTag(id, { user: msg.author.id, src: newSrc })
      return `Added \`${id}\``
    })
  }
})
