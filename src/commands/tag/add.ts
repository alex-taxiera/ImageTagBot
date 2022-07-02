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
      type: 3, name: 'id', description: 'The tag id', required: true,
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
      ?.find((option) => option.name === 'add')

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

    const tag = await getTag(id)
    if (tag) {
      await interaction.createMessage({
        content: `Tag \`${id}\` already exists`,
        flags: 64,
      })
      return
    }

    let newSrc: string | undefined
    try {
      await interaction.defer(64)
      newSrc = await uploadToImgur(url)
    } catch (e) {
      if (e instanceof ImgurError) {
        switch (e.code) {
          case 1003: {
            await interaction.createMessage({
              content: 'Tag url is not an image',
              flags: 64,
            })
            return
          }
          default: {
            await interaction.createMessage({
              content: 'Failed to upload tag',
              flags: 64,
            })
            return
          }
        }
      } else if (e instanceof UploadValidationError) {
        await interaction.createMessage({
          content: e.message,
          flags: 64,
        })
        return
      } else {
        throw e
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const user = interaction.member?.user ?? interaction.user!
    await upsertTag({
      id, user: user.id, src: newSrc,
    })

    await interaction.createMessage({
      content: `Tag \`${id}\` added`,
      flags: 64,
    })
  },
}
