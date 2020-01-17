import {
  SQLManager
} from 'eris-boiler'

export class TagDatabaseManager extends SQLManager {

  async addTag (userId: string, key: string, src: string) {
    return this._qb.insert({ table: 'tags', data: { userId, key, src } })
  }

  getTag (key: string) {
    return this._qb.get({ table: 'tags', where: { key } })
  }

  updateTag (key: string, src: string) {
    return this._qb.update({ table: 'tags', data: { src }, where: { key } })
  }

  removeTag (key: string) {
    return this._qb.delete({ table: 'tags', where: { key } })
  }

  selectAllTags () {
    return this._qb.select({ table: 'tags' })
  }

  selectTagsForUser (userId: string) {
    return this._qb.select({ table: 'tags', where: { userId } })
  }

  searchLikeTags (key: string) {
    return this._qb._knex('tags').select('*').where('key', 'like', `%${key}%`)
      .then((rows: Array<any>) => rows.length ? rows : [])
  }

  incrementTagCount (key: string) {
    return this._qb.increment({ table: 'tags', column: 'count', amount: 1, where: { key } })
  }
}
