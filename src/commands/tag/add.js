const { Command } = require('eris-boiler')

module.exports = new Command({
  name: 'add',
  description: 'Add a tag',
  options: {
    aliases: ['create'],
    parameters: ['tag key']
  },
  run: async function ({ bot, msg, params }) {
    const [key, url] = params
    const src = msg.attachments.length > 0 ? msg.attachments[0].url : url

    if (!key) return 'Missing key!'
    if (!src) return 'Please attach an image or specify a url!'
    if (!bot.IMAGE_REGEXP.test(src.toLowerCase())) return 'Not an image!'

    let exists
    try {
      exists = await bot.dbm.getTag(key)
    } catch (error) {
      console.log('error :', error)
      return 'The database encountered an error!'
    }
    if (exists) return `Tag \`${key}\` already exists`

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
      await bot.dbm.addTag(msg.author.id, key, uploaded.data.link)
      return `Added \`${key}\``
    } catch (error) {
      return 'There was a problem updating the database!'
    }
  }
})
