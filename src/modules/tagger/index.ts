import {
  DataClient, DataClientOptions
} from 'eris-boiler'
import {
  Imgur
} from '@imgur'

export class TaggerClient extends DataClient {
  protected readonly imgur: Imgur
  protected readonly IMAGE_REGEXP = /^(https|http):?\/(.*).(png|jpeg|jpg|gif|gifv)/
  constructor (token: string, imgurClientId: string, options?: DataClientOptions) {
    super(token, options)
    this.imgur = new Imgur(imgurClientId)
  }
}
