import {
  DataClient,
  OratorOptions,
  StatusManagerOptions,
  CommandContext,
  Command as BaseCommand,
  Permission as BasePermission,
  ConnectionData,
  DatabaseManagerOptions,
  DataClientOptions,
  DatabaseObject
} from 'eris-boiler'
import * as imgur from 'imgur'

export type TagDatabaseConfig = {
  connection: ConnectionData
  options?: DatabaseManagerOptions
}
export type TaggerClientOptions = {
  oratorOptions?: OratorOptions
  statusManagerOptions?: StatusManagerOptions
}
export class TaggerClient extends DataClient {
  private readonly api = imgur
  public readonly IMAGE_REGEXP = /^(https|http):?\/(.*).(png|jpeg|jpg|gif|gifv)/

  constructor (token: string, imgurClientId: string, options?: DataClientOptions) {
    super(token, options)
    this.api.setAPIUrl('https://api.imgur.com/3/')
    this.api.setClientId(imgurClientId)
  }

  uploadToImgur (url: string): Promise<any> {
    return this.api.uploadUrl(url)
  }

  async upsertTag (key: string, data: { key?: string; src?: string; userId?: string; count?: number }): Promise<DatabaseObject> {
    const tag = await this.getTag(key)
    if (tag) {
      return tag.save(data)
    }

    return this.dbm.newObject('tag', { key, ...data }).save()
  }
  
  async removeTag (key: string): Promise<void> {
    const tag = await this.getTag(key)
    if (tag) {
      return tag.delete()
    }
  }

  getTag (key: string): Promise<DatabaseObject | void> {
    return this.dbm.newQuery('tag').get(key, 'key')
  }

  getTags (): Promise<Array<DatabaseObject>> {
    return this.dbm.newQuery('tag').find()
  }

  getTagsForUser (userId: string): Promise<Array<DatabaseObject>> {
    return this.dbm.newQuery('key').equalTo('userId', userId).find()
  }

  async searchSuggestions (key: string): Promise<Array<DatabaseObject>> {
    const tags = await this.getTags()

    return tags.filter((tag) => tag.get('key').includes(key))
  }

  async incrementTagCount (key: string): Promise<number | void> {
    const tag = await this.getTag(key)
    if (tag) {
      const count = tag.get('count') + 1
      await this.upsertTag(key, { count })
      return count
    }
  }
}

export class Command<
  C extends CommandContext = CommandContext,
  T extends DataClient = TaggerClient
> extends BaseCommand<T, C> {}
export class Permission<
  T extends DataClient = TaggerClient
> extends BasePermission<T> {}
