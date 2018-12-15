class ImgurManager {
  constructor () {
    this._imgur = require('imgur')

    this._imgur.setClientId(process.env.IMGUR_CLIENT_ID)
    this._imgur.setAPIUrl('https://api.imgur.com/3/')
  }

  upload (url) {
    return this._imgur.uploadUrl(url)
  }
}

module.exports = ImgurManager
