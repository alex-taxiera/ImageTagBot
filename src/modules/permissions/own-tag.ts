import { Permission } from '@hephaestus/eris'
import { getTag } from '@modules/tagger'

export const ownTag = (key: string): Permission => ({
  name: 'ownTag',
  level: 800,
  reason: 'You do not own this tag!',
  action: async (interaction) => {
    const option = interaction.data.options
      ?.find((option) => option.name === key)

    if (option?.type !== 3) {
      return false
    }

    const id = option.value
    if (!id) {
      return false
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const user = interaction.member?.user ?? interaction.user!

    let tag
    try {
      tag = await getTag(id)
    } catch (error) {
      return false
    }

    return user.id === tag?.user
  },
})
