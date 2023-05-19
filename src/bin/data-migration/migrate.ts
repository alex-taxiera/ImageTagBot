// a script that reads the data in old.csv, fetches the image from the old url,
// uploads it to the new share service, and writes a new csv with all the old data and the url from the share api response
import path from 'path'
import * as url from 'url'
import {
  readFileSync,
  writeFileSync,
} from 'fs'
import { uploadToShare } from '~modules/tagger'

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

  const userId = cols[1]!
  const url = cols[2]!

  console.log('userId :', userId)
  console.log('url :', url)

  if (userId == null || url == null) {
    continue
  }

  const newUrl = await uploadToShare(url, userId)

  newLines.push(`${line},${newUrl}`)
}

// now write the new csv
writeFileSync('./new.csv', newLines.join('\n'))
