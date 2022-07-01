import { Permission } from '@hephaestus/eris'
import { getTag } from '@tagger'

export const ownTag: Permission = {
  name: 'ownTag',
  level: 800,
  reason: 'You do not own this tag!',
  action: async (interaction) => {
    const option = interaction.data.options
      ?.find((option) => option.name === 'id')

    if (option?.type !== 3) {
      return false
    }

    const id = option.value
    if (!id) {
      return false
    }

    const msg = await interaction.getOriginalMessage()

    let tag
    try {
      tag = await getTag(id)
    } catch (error) {
      return false
    }

    return msg.author.id === tag?.user
  },
}
