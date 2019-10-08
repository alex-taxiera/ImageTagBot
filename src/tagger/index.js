const { DataClient } = require('eris-boiler')
const TagDatabaseManager = require('./TagDatabaseManager')
const ImgurManager = require('./ImgurManager')

class TaggerClient extends DataClient {
  constructor (token, options = {}) {
    options.databaseManager = new TagDatabaseManager(options.dbInfo)
    super(token, options)
    this.imgur = new ImgurManager()
    this.IMAGE_REGEXP = new RegExp(/^(https|http):?\/(.*).(png|jpeg|jpg|gif|gifv)/)
  }
}

module.exports = TaggerClient
