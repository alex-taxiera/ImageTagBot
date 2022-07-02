import { SubCommand } from '@hephaestus/eris'

import {
  getTag,
  IMAGE_REGEXP,
  autocompleteSuggestions,
} from '@tagger'

export const info: SubCommand = {
  type: 1,
  name: 'info',
  description: 'Get info on a tag.',
  options: [
    {
      type: 3,
      name: 'name',
      description: 'The tag to get info on',
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
  action: async (interaction, client) => {
    const subCommand = interaction.data.options
      ?.find((option) => option.name === 'info')

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

    const user = await client.getRESTUser(tag.user)

    await interaction.createMessage({
      embeds: [
        {
          author: {
            name: `${user?.username ?? 'ERR'}#${user?.discriminator ?? 'ERR'}`,
            icon_url: user?.avatarURL,
          },
          thumbnail: {
            url: IMAGE_REGEXP.test(tag.src) ? tag.src : '',
          },
          fields: [
            {
              name: 'Tag Name',
              value: tag.id,
            },
            {
              name: 'Tag Source',
              value: tag.src,
            },
            {
              name: 'Use Count',
              value: tag.count.toString(),
            },
          ],
        },
      ],
    })
  },
}
