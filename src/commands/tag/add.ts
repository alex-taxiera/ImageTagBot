import { SubCommand } from '@hephaestus/eris'
import {
  getTag,
  uploadToImgur,
  UploadValidationError,
  upsertTag,
} from '@tagger'
import { ImgurError } from '@tagger/exceptions'

export const add: SubCommand = {
  type: 1,
  name: 'add',
  description: 'Add a tag',
  options: [
    {
      type: 3, name: 'id', description: 'The tag id',
    },
    {
      type: 3, name: 'url', description: 'The tag url', required: false,
    },
  ],
  action: async (interaction) => {
    const idOption = interaction.data.options
      ?.find((option) => option.name === 'id')
    if (idOption?.type !== 3) {
      await interaction.createFollowup('Missing id!')
      return
    }
    const id = idOption.value
    const urlOption = interaction.data.options
      ?.find((option) => option.name === 'url')

    const msg = await interaction.getOriginalMessage()
    let url = msg.attachments[0]?.url
    if (url == null) {
      if (urlOption?.type !== 3) {
        await interaction.createFollowup(
          'Please attach an image or specify a url!',
        )
        return
      }
      url = urlOption.value
    }

    const tag = await getTag(id)
    if (tag) {
      await interaction.createFollowup(`Tag \`${id}\` already exists`)
      return
    }

    let newSrc: string | undefined
    try {
      await msg.channel.sendTyping()
      newSrc = await uploadToImgur(url)
    } catch (e) {
      if (e instanceof ImgurError) {
        switch (e.code) {
          case 1003: {
            await interaction.createFollowup('Bad URL!')
            return
          }
          default: {
            await interaction.createFollowup('Unknown error!')
            return
          }
        }
      } else if (e instanceof UploadValidationError) {
        await interaction.createFollowup(e.message)
        return
      } else {
        throw e
      }
    }
    await upsertTag({
      id, user: msg.author.id, src: newSrc,
    })

    await interaction.createFollowup(`Added \`${id}\``)
  },
}
