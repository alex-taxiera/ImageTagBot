import { TopLevelCommand } from '@hephaestus/eris'
import { mine } from './mine'
import { top } from './top'

const command: TopLevelCommand = {
  type: 1,
  guildId: '436591833196265473',
  name: 'list',
  description: 'List tags.',
  options: [ mine, top ],
}

export default command
