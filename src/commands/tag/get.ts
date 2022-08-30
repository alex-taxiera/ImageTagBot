import fetch from 'node-fetch'

import { createCommand } from '@hephaestus/eris'

import { cooldownMiddlewareFactory } from '@modules/cooldown/middleware'
import { CooldownHandler } from '@modules/cooldown/CooldownHandler'
import {
  getTag,
  IMAGE_REGEXP,
  incrementTagCount,
  autocompleteSuggestions,
} from '@modules/tagger'

export const get = createCommand({
  guildId: '436591833196265473',
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
    const ext = IMAGE_REGEXP.exec(tag.src.toLowerCase())?.pop() ?? ''
    incrementTagCount(tag.id)
      // eslint-disable-next-line no-console
      .catch((error) => console.error('failed to count', error))

    await interaction.createMessage('', {
      file: await res.buffer(),
      name: `${tag.id}.${ext}`,
    })
  },
})
