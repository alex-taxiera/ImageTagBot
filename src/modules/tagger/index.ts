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
import FormData from 'form-data'
import fetch from 'node-fetch'

import { ImgurError, ImgurException } from './exceptions'
import { streamFromBuffer } from '@file'

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
  public readonly IMAGE_REGEXP = /^(?:https|http):?\/.*\.(\w+)/

  constructor (
    token: string,
    imgurClientId: string,
    options?: DataClientOptions
  ) {
    super(token, options)
    this.imgurClientId = imgurClientId
  }

  public async uploadToImgur (
    src: string,
    type: 'image' | 'video' = 'image',
    title: string = 'Cool Image'
  ): Promise<string> {
    const res = await fetch(src)
    const data = await res.buffer()
    const size = Buffer.byteLength(data)

    if (size > 1024 * 1024 * (type === 'image' ? 10 : 200)) {
      throw Error('File is too big!')
    }

    const stream = streamFromBuffer(data)
    const form = new FormData()
    form.append('title', title)
    form.append(type, stream, {
      filename: 'test.gif',
      contentType: res.headers.get('content-type') ?? undefined,
      knownLength: size
    })
    form.append('type', 'file')

    const body = await fetch(`${this.API_URL}/upload`, {
      method: 'POST',
      headers: {
        ...form.getHeaders(),
        Authorization: `Client-ID ${this.imgurClientId}`
      },
      body: form
    }).then((res) =>
      res.json() as unknown as {data: {error?: ImgurException; link?: string}}
    )

    const {
      data: { error, link }
    } = body

    if (error) {
      throw new ImgurError(error)
    } else if (!link) {
      throw Error('No Link')
    }

    return link
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
    return this.dbm.newQuery('tag').equalTo('user', user).find()
  }

  public async searchSuggestions (id: string): Promise<Array<DatabaseObject>> {
    const tags = await this.getTags()

    return tags.filter((tag) => (<string>tag.get('id')).includes(id))
  }

  public async incrementTagCount (id: string): Promise<number | void> {
    const tag = await this.getTag(id)
    if (tag) {
      const count = <number>tag.get('count') + 1
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
