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
import request from '@http'

export type TagDatabaseConfig = {
  connection: ConnectionData
  options?: DatabaseManagerOptions
}
export type TaggerClientOptions = {
  oratorOptions?: OratorOptions
  statusManagerOptions?: StatusManagerOptions
}
export class TaggerClient extends DataClient {
  private readonly API_URL = 'https://api.imgur.com/3'
  private readonly imgurClientId: string
  public readonly IMAGE_REGEXP = /^(https|http):?\/(.*).(png|jpeg|jpg|gif|gifv)/

  constructor (
    token: string,
    imgurClientId: string,
    options?: DataClientOptions
  ) {
    super(token, options)
    this.imgurClientId = imgurClientId
  }

  public async uploadToImgur (src: string): Promise<string> {
    const { body } = await request(`${this.API_URL}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${this.imgurClientId}`
      },
      body: src
    })

    const res = JSON.parse(body.toString())
    if (res.data.error) {
      throw Error(res.data.error)
    }
    return res.data.link
  }

  public async upsertTag (
    id: string,
    data: { id?: string; src?: string; user?: string; count?: number }
  ): Promise<DatabaseObject> {
    const tag = await this.getTag(id)
    if (tag) {
      return tag.save(data)
    }

    return this.dbm.newObject('tag', { id, ...data }).save()
  }

  public async removeTag (id: string): Promise<void> {
    const tag = await this.getTag(id)
    if (tag) {
      return tag.delete()
    }
  }

  public getTag (id: string): Promise<DatabaseObject | void> {
    return this.dbm.newQuery('tag').get(id, 'id')
  }

  public getTags (): Promise<Array<DatabaseObject>> {
    return this.dbm.newQuery('tag').find()
  }

  public getTagsForUser (user: string): Promise<Array<DatabaseObject>> {
    return this.dbm.newQuery('id').equalTo('user', user).find()
  }

  public async searchSuggestions (id: string): Promise<Array<DatabaseObject>> {
    const tags = await this.getTags()

    return tags.filter((tag) => tag.get('id').includes(id))
  }

  public async incrementTagCount (id: string): Promise<number | void> {
    const tag = await this.getTag(id)
    if (tag) {
      const count = tag.get('count') + 1
      await this.upsertTag(id, { count })
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
