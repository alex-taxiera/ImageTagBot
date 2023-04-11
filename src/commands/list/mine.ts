import { createCommand } from '@hephaestus/eris'
import { prisma } from '~modules/utils/db'

export const mine = createCommand({
  type: 1,
  name: 'mine',
  description: 'List your tags',
  action: async (interaction) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const user = interaction.member?.user ?? interaction.user!

    const tags = await prisma.tag.findMany({ where: { user: user.id } })
    if (tags.length === 0) {
      await interaction.createMessage({
        content: 'You have no tags',
        flags: 64,
      })
      return
    }

    return await interaction.createMessage({
      flags: 64,
      embeds: [
        {
          title: 'Your Tags',
          description: tags
            .map((tag) => `${tag.id} (${tag.count.toString()})`)
            .join('\n'),
        },
      ],
    })
  },
})
