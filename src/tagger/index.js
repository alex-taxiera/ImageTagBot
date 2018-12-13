const { DataClient } = require('eris-boiler')
const TagDatabaseManager = require('./TagDatabaseManager')
const ImgurManager = require('./imgurClient')

class TaggerClient extends DataClient {
  constructor (opt = {}) {
    super(opt)
    this.tag = new TagDatabaseManager()
    this.imgur = new ImgurManager(this)
  }
}

module.exports = TaggerClient
