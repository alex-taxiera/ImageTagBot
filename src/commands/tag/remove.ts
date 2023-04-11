import { createCommand } from '@hephaestus/eris'
import { autocompleteSuggestions } from '~modules/tagger'
import { ownTag } from '~modules/permissions/own-tag'
import { prisma } from '~modules/utils/db'

export const remove = createCommand({
  type: 1,
  name: 'remove',
  description: 'Remove a tag',
  permission: ownTag('name'),
  options: [
    {
      type: 3,
      name: 'name',
      description: 'The tag to remove',
      required: true,
      autocomplete: true,
      autocompleteAction: async (interaction, focusedOption) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const user = interaction.member?.user ?? interaction.user!

        const suggestions = await autocompleteSuggestions(
          focusedOption.value, user.id,
        )
        await interaction.result(suggestions.map((suggestion) => ({
          name: suggestion.id,
          value: suggestion.id,
        })))
      },
    },
  ] as const,
  action: async (interaction, args) => {
    await prisma.tag.delete({ where: { id: args.name.value } })

    await interaction.createMessage({
      content: `Tag \`${args.name.value}\` removed`,
      flags: 64,
    })
  },
})
