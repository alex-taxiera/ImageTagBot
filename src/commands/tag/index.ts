import { TopLevelCommand } from '@hephaestus/eris'

import { cooldownMiddlewareFactory } from '@cooldown/middleware'
import { CooldownHandler } from '@cooldown/CooldownHandler'

import { add } from './add'
import { get } from './get'
import { info } from './info'
import { remove } from './remove'
import { update } from './update'

const command: TopLevelCommand = {
  type: 1,
  name: 'tag',
  description: 'Finds, Adds, Remove, or Edit tags',
  middleware: [
    cooldownMiddlewareFactory(new CooldownHandler()),
  ],
  options: [ get, add, remove, update, info ],
}

export default command
