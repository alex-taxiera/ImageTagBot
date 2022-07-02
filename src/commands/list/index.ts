import { TopLevelCommand } from '@hephaestus/eris'
import { mine } from './mine'
import { top } from './top'

const command: TopLevelCommand = {
  type: 1,
  name: 'list',
  description: 'List tags.',
  options: [ mine, top ],
}

export default command
