import { InteractionDataOptions } from 'eris'
import { Permission } from '@hephaestus/eris'
import { getTag } from '~modules/tagger'
import { unknownHasKey } from '~utils/unknown-has-key'

export const ownTag = (key: string): Permission => ({
  name: 'ownTag',
  level: 800,
  reason: 'You do not own this tag!',
  action: async (interaction, options) => {
    if (!unknownHasKey(options, key)) {
      return false
    }

    const option = options[key] as InteractionDataOptions

    if (option.type !== 3) {
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
