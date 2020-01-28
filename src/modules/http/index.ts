import https from 'https'
import http from 'http'
import { URL } from 'url'

const requesters = {
  'http:': http,
  'https:': https
}

export default function request (
  url: string,
  options: any = {}
): Promise<{ req: http.ClientRequest; res: http.IncomingMessage; body: Buffer }> {
  const {
    method = 'GET'
  } = options

  if (!http.METHODS.includes(method.toUpperCase())) {
    return Promise.reject(Error(`INVALID METHOD: ${method.toUpperCase()}`))
  }

  const address = new URL(url)
  const protocol = requesters[address.protocol as 'http:' | 'https:']
  if (!protocol) {
    return Promise.reject(Error(`INVALID PROTOCOL: ${address.protocol}`))
  }

  return new Promise((resolve, reject) => {
    const {
      body,
      ...reqOptions
    } = options

    const req = protocol.request(address, { ...reqOptions, method }, (res) => {
      const chunks: Array<Buffer> = []
      res.on('data', (chunk: Buffer) => chunks.push(chunk))
      res.on('end', () => {
        if (res.complete) {
          resolve({ req, res, body: Buffer.concat(chunks) })
        } else {
          reject(Error('REQUEST NOT COMPLETED'))
        }
      })
    })

    req.on('error', reject)
    if (body) {
      req.write(body)
    }
    req.end()
  })
}
