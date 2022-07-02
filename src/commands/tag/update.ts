import { SubCommand } from '@hephaestus/eris'
import { autocompleteSuggestions } from '@tagger'
import { ownTag } from '@permissions/own-tag'
import { prisma } from '@utils/db'

export const update: SubCommand = {
  type: 1,
  name: 'update',
  description: 'Update a tag',
  permission: ownTag,
  options: [
    {
      type: 3,
      name: 'name',
      description: 'The tag to update',
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
    {
      type: 3, name: 'url', description: 'The tag url', required: true,
    },
    // {
    //   type: 11,
    //   name: 'attachment',
    //   description: 'The tag attachment',
    //   required: false,
    // },
  ],
  action: async (interaction) => {
    const subCommand = interaction.data.options
      ?.find((option) => option.name === 'get')

    if (subCommand?.type !== 1) {
      await interaction.createMessage('bork!')
      return
    }

    const idOption = subCommand.options
      ?.find((option) => option.name === 'id')

    if (idOption?.type !== 3) {
      await interaction.createMessage({
        content: 'Please provide a tag id',
        flags: 64,
      })
      return
    }
    const id = idOption.value
    const urlOption = subCommand.options
      ?.find((option) => option.name === 'url')

    // const attachmentOption = subCommand.options
    //   ?.find((option) => option.name === 'attachment')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let url // = attachmentOption?.type === 11 ? attachmentOption.value : null

    if (url == null) {
      if (urlOption?.type !== 3) {
        await interaction.createMessage({
          content: 'Please provide a url or attachment',
          flags: 64,
        })
        return
      }
      url = urlOption.value
    }

    await prisma.tag.update({ where: { id }, data: { src: url } })

    await interaction.createMessage({
      content: `Tag \`${id}\` updated`,
      flags: 64,
    })
  },
}
