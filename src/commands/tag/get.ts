import fetch from 'node-fetch'

import { createCommand } from '@hephaestus/eris'

import { cooldownMiddlewareFactory } from '~modules/cooldown/middleware'
import { CooldownHandler } from '~modules/cooldown/CooldownHandler'
import {
  getTag,
  incrementTagCount,
  autocompleteSuggestions,
} from '~modules/tagger'
import { log } from '~modules/logger'

export const get = createCommand({
  type: 1,
  name: 'get',
  description: 'Finds, Adds, Remove, or Edit tags',
  middleware: [
    cooldownMiddlewareFactory(new CooldownHandler()),
  ],
  options: [
    {
      type: 3,
      name: 'name',
      description: 'The tag to get',
      required: true,
      autocomplete: true,
      autocompleteAction: async (interaction, focusedOption) => {
        const suggestions = await autocompleteSuggestions(focusedOption.value)
        await interaction.result(suggestions.map((suggestion) => ({
          name: suggestion.id,
          value: suggestion.id,
        })))
      },
    },
  ] as const,
  action: async (interaction, args) => {
    const tag = await getTag(args.name.value)

    if (!tag) {
      await interaction.createMessage({
        content: `Tag \`${args.name.value}\` doesn't exist`,
        flags: 64,
      })
      return
    }

    const res = await fetch(tag.src)
    const file = await res.buffer()

    log.debug(res)
    log.debug(res.body)
    log.debug(tag)
    log.debug('get file', file)
    log.debug(res.headers.get('content-type'))

    const ext = res.headers.get('content-type')?.split('/').pop() ?? ''

    incrementTagCount(tag.id)
      .catch((error) => log.error('failed to count', error))

    await interaction.createMessage('', {
      file,
      name: `${tag.id}.${ext}`,
    })
  },
})
