import path from 'path'
import * as url from 'url'
import {
  readFileSync,
  writeFileSync,
} from 'fs'
import { uploadToShare } from '~modules/tagger'
import { log } from '~modules/logger'

// get the path to the csv
const oldCsvPath = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  'old.csv',
)
const oldCsv = readFileSync(oldCsvPath, 'utf-8')

const lines = oldCsv.split('\n')

const newLines = []

for (const line of lines) {
  const cols = line.split(',')

  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const userId = cols[1]!
  const url = cols[2]!
  /* eslint-enable @typescript-eslint/no-non-null-assertion */

  log.info('userId :', userId)
  log.info('url :', url)

  if (userId == null || url == null) {
    continue
  }

  const newUrl = await uploadToShare(url, userId)

  newLines.push(`${line},${newUrl}`)
}

// now write the new csv
writeFileSync('./new.csv', newLines.join('\n'))
