import fetch from 'node-fetch'

import { SubCommand } from '@hephaestus/eris'

import { cooldownMiddlewareFactory } from '@cooldown/middleware'
import { CooldownHandler } from '@cooldown/CooldownHandler'
import {
  getTag,
  IMAGE_REGEXP,
  incrementTagCount,
  autocompleteSuggestions,
} from '@tagger'

export const get: SubCommand = {
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
      autocompleteAction: async (interaction) => {
        const subCommand = interaction.data.options
          ?.find((option) => option.name === 'get')

        if (subCommand?.type !== 1) {
          await interaction.result([])
          return
        }
        const focusedOption = subCommand.options
          ?.find((option) => 'focused' in option)
        if (focusedOption?.type !== 3) {
          await interaction.result([])
          return
        }

        const suggestions = await autocompleteSuggestions(focusedOption.value)
        await interaction.result(suggestions.map((suggestion) => ({
          name: suggestion.id,
          value: suggestion.id,
        })))
      },
    },
  ],
  action: async (interaction) => {
    const subCommand = interaction.data.options
      ?.find((option) => option.name === 'get')

    if (subCommand?.type !== 1) {
      await interaction.createMessage('bork!')
      return
    }

    const option = subCommand.options?.find((option) => option.name === 'name')

    if (option?.type !== 3) {
      await interaction.createMessage({
        content: 'Please provide a tag name',
        flags: 64,
      })
      return
    }

    const tag = await getTag(option.value)
    if (!tag) {
      await interaction.createMessage({
        content: `Tag \`${option.value}\` doesn't exist`,
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
      name: `${option.value}.${ext}`,
    })
  },
}
