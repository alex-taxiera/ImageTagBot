import { createCommand } from '@hephaestus/eris'
import { mine } from './mine'
import { top } from './top'

const list = createCommand({
  type: 1,
  name: 'list',
  description: 'List tags.',
  options: [ mine, top ],
})

export default list
