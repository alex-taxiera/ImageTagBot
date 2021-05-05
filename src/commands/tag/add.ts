import { Command, UploadValidationError } from '@tagger'
import { ImgurError } from '@tagger/exceptions'
import { logger } from 'eris-boiler/util'

export default new Command({
  name: 'add',
  description: 'Add a tag',
  options: {
    aliases: [ 'create' ],
    parameters: [ 'tag id' ]
  },
  run: function (bot, { msg, params }) {
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
            default:
              logger.error('imgur error :>> ', e)
              return 'Unknown error!'
          }
        } else if (e instanceof UploadValidationError) {
          return e.message
        } else {
          throw e
        }
      }
      await bot.upsertTag(id, { user: msg.author.id, src: newSrc })
      return `Added \`${id}\``
    })
  }
})
