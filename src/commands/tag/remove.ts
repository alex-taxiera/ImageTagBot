import { SubCommand } from '@hephaestus/eris'
import { autocompleteSuggestions } from '@tagger'
import { ownTag } from '@permissions/own-tag'
import { prisma } from '@utils/db'

export const remove: SubCommand = {
  type: 1,
  name: 'remove',
  description: 'Remove a tag',
  permission: ownTag,
  options: [
    {
      type: 3,
      name: 'name',
      description: 'The tag to remove',
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

    await prisma.tag.delete({ where: { id: option.value } })

    await interaction.createMessage({
      content: `Tag \`${option.value}\` removed`,
      flags: 64,
    })
  },
}
