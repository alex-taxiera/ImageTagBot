import { createCommand } from '@hephaestus/eris'
import { prisma } from '@modules/utils/db'

export const top = createCommand({
  type: 1,
  name: 'top',
  description: 'top 10 tags', // TODO: add sub commands for guild/user top 10 ("help top" for filters)
  action: async (interaction) => {
    const tags = await prisma.tag.findMany({
      orderBy: { count: 'desc' },
      take: 10,
    })
    if (tags.length === 0) {
      await interaction.createMessage({
        content: 'No tags found',
        flags: 64,
      })
      return
    }

    await interaction.createMessage({
      flags: 64,
      embeds: [
        {
          title: 'Top 10 Tags!',
          description: tags
            .map((tag) => `${tag.id} (${tag.count.toString()})`)
            .join('\n'),
        },
      ],
    })
  },
})
