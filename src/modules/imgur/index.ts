import * as imgur from 'imgur'

export class Imgur {
  private readonly api = imgur
  constructor (clientId: string) {
    this.api.setAPIUrl('https://api.imgur.com/3/')
    this.api.setClientId(clientId)
  }

  upload (url: string): Promise<any> {
    return this.api.uploadUrl(url)
  }
}
