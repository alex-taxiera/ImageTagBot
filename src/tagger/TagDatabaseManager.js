const { SQLManager } = require('eris-boiler')

class TagDatabaseManager extends SQLManager {
  constructor (dbInfo) {
    super({ dbInfo })
  }

  async addTag (userId, key, src) {
    return this._qb.insert({ table: 'tags', data: { userId, key, src } })
  }

  getTag (key) {
    return this._qb.get({ table: 'tags', where: { key } })
  }

  updateTag (key, src) {
    return this._qb.update({ table: 'tags', data: { src }, where: { key } })
  }

  removeTag (key) {
    return this._qb.delete({ table: 'tags', where: { key } })
  }

  selectAllTags () {
    return this._qb.select({ table: 'tags' })
  }

  selectTagsForUser (userId) {
    return this._qb.select({ table: 'tags', where: { userId } })
  }

  searchLikeTags (key) {
    return this._qb._knex('tags').select('*').where('key', 'like', `%${key}%`)
      .then((rows) => rows[0] ? rows : [])
  }

  incrementTagCount (key) {
    return this._qb.increment({ table: 'tags', column: 'count', amount: 1, where: { key } })
  }
}

module.exports = TagDatabaseManager
