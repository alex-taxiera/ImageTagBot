import { CommandResults } from 'eris-boiler'

import { Command } from '@tagger'
import ownTag from '@tagger/permissions/own-tag'

export default new Command({
  name: 'update',
  description: 'Update a tag',
  options: {
    aliases: [ 'edit' ],
    parameters: [ 'tag key' ],
    permission: ownTag
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
    if (!bot.IMAGE_REGEXP.test(src)) {
      return 'Not an image!'
    }

    return bot.getTag(key).then(async (tag) => {
      if (!tag) {
        return 'Tag doesn\'t exist'
      }

      const newTag = await bot.uploadToImgur(src)
      await bot.upsertTag(key, { src: newTag.data.link })
      return `Updated \`${key}\``
    })
  }
})
