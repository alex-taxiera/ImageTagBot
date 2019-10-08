const { Command } = require('eris-boiler')

const ownTag = require('../../permissions/own-tag')

module.exports = new Command({
  name: 'update',
  description: 'Update a tag',
  options: {
    aliases: ['edit'],
    parameters: ['tag key'],
    permission: ownTag
  },
  run: async function ({ bot, msg, params }) {
    const [key, url] = params
    const src = msg.attachments.length > 0 ? msg.attachments[0].url : url

    if (!key) return 'Missing key!'
    if (!src) return 'Please attach an image or specify a url!'
    if (!bot.IMAGE_REGEXP.test(src)) return 'Not an image!'

    let tag
    try {
      tag = await bot.dbm.getTag(key)
    } catch (error) {
      return 'The database encountered an error!'
    }
    if (!tag) return 'Tag doesn\'t exist'

    let uploaded
    try {
      uploaded = await bot.imgur.upload(src)
      if (!uploaded.data) {
        throw Error('No data from imgur')
      }
    } catch (error) {
      return 'There was a problem uploading your image!'
    }

    try {
      await bot.dbm.updateTag(key, uploaded.data.link)
      return `Update tag \`${key}\``
    } catch (error) {
      return 'There was a problem updating the database!'
    }
  }
})
