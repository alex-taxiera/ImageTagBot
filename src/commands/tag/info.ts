import { createCommand } from '@hephaestus/eris'

import {
  getTag,
  IMAGE_REGEXP,
  autocompleteSuggestions,
} from '~modules/tagger'

export const info = createCommand({
  guildId: '436591833196265473',
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
      autocompleteAction: async (interaction, focusedOption) => {
        const suggestions = await autocompleteSuggestions(focusedOption.value)
        await interaction.result(suggestions.map((suggestion) => ({
          name: suggestion.id,
          value: suggestion.id,
        })))
      },
    },
  ] as const,
  action: async (interaction, args, heph) => {
    const tag = await getTag(args.name.value)
    if (!tag) {
      await interaction.createMessage({
        content: `Tag \`${args.name.value}\` doesn't exist`,
        flags: 64,
      })
      return
    }

    const user = await heph.client.getRESTUser(tag.user)

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
})
