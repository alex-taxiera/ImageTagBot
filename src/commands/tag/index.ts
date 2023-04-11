import { createCommand } from '@hephaestus/eris'

import { cooldownMiddlewareFactory } from '~modules/cooldown/middleware'
import { CooldownHandler } from '~modules/cooldown/CooldownHandler'

import { add } from './add'
import { get } from './get'
import { info } from './info'
import { remove } from './remove'
import { update } from './update'

const tag = createCommand({
  type: 1,
  name: 'tag',
  description: 'Finds, Adds, Remove, or Edit tags',
  middleware: [
    cooldownMiddlewareFactory(new CooldownHandler()),
  ],
  options: [
    add,
    get,
    info,
    remove,
    update,
  ],
})

export default tag
