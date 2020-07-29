import { Duplex } from 'stream'

export function streamFromBuffer (data: Buffer): Duplex {
  const stream = new Duplex()
  stream.push(data)
  stream.push(null)

  return stream
}
