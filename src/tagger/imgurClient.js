const imgur = require('imgur')

class ImgurManager {
  constructor (bot) {
    this.bot = bot

    imgur.setClientId(process.env.IMGUR_CLIENT_ID)
    imgur.setAPIUrl('https://api.imgur.com/3/')
  }

  handleTag (tag) {
    return imgur.uploadUrl(tag.src)
  }
}

module.exports = ImgurManager
